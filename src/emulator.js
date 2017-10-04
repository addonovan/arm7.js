/* document set up */

var Emulator = {
    registerCount: 16,
    registers: [],
    address: {},
    labels: {},
    utils: {},
    ops: {},
    controls: {},
    registerBase: 10,
    redraw: function(type)
    {
        if (type === undefined) type = Emulator.registerBase;
        else Emulator.registerBase = type;

        for (var i = 0; i < Emulator.registerCount; i++)
        {
            var reg = getRegisterObject(i);
            switch (type)
            {
                case 2:
                    reg = reg.bin();
                    break;

                case 16:
                    reg = reg.hex();
                    break;

                default:
                    reg = reg.dec();
                    break;
            }
            $("td#r" + i).text(reg);
        }
    },
    nextLine: () =>
    {
        this.hideLine();
        Emulator.controls.offset += 4;
        this.updateLine();
    },
    hideLine: () => $("li[addr=" + Emulator.controls.offset + "]").removeClass("selected"),
    updateLine: () => $("li[addr=" + Emulator.controls.offset + "]").addClass("selected"),
    ready: () => {}

}

Emulator.utils.setStatus = function(bitName, flag)
{
    var reg = Emulator.getRegister(15);
    var bitNum;
    switch (bitName.toUpperCase())
    {
        case 'N':
            bitNum = 0;
            break;

        case 'Z':
            bitNum = 1;
            break;

        case 'C':
            bitNum = 2;
            break;

        case 'V':
            bitNum = 3;
            break;

        default:
            throw new Error("Waaahhh bitName must be one of: NZCV");
    }

    reg.bits[bitNum] = flag;
}


class i32
{
    constructor(value)
    {
        this.bits = [];
        for (var i = 0; i < 32; i++)
        {
            this.bits.push(0);
        }

        if (value === undefined) return;

        if (value.constructor === i32)
        {
            this.bits = value.bits;
        }
        else if (value.constructor === Array)
        {
            var i = 31;
            var j = value.length - 1;
            while (i >= 0 && j >= 0)
            {
                this.bits[i] = parseInt(value[j], 2) | 0;
                j--;
                i--;
            }
        }
        else if (value < 0)
        {
            this.bits = new i32(-value).neg().bits;
        }
        else
        {
            var binary = value.toString(2);

            // fill it in, right to left
            var i = 31;
            var j = binary.length - 1;
            while (i >= 0 && j >= 0)
            {
                this.bits[i] = parseInt(binary[j], 2) | 0
                j--;
                i--;
            }
        }
    }

    static fromLiteral(literal)
    {
        switch (literal.subtype)
        {
            // the easiest one!
            case "binary":
                return new i32(literal.val.split(""));

                // manually expand so we don't lose any precision converting
                // to floating points
            case "hexadecimal":
                var bitpattern = "";

                var split = literal.val.split("");
                for (var i = 0; i < split.length; i++)
                {
                    var bits = "0000";
                    bits += "0123456789ABCDEF".indexOf(split[i].toUpperCase()).toString(2);
                    bitpattern += bits.substr(-4);
                }

                return new i32(bitpattern);

            case "decimal":
                var bitpattern = parseInt(literal.val).toString(2);
                return new i32(bitpattern);
        }
    }

    copy(other)
    {
        this.bits = other.bits;
    }

    flip()
    {
        for (var i = 31; i >= 0; i--)
        {
            this.bits[i] ^= 1;
        }

        return this;
    }

    neg()
    {
        if (this.bits[0] === 0)
            return this.flip().add(new i32(1), false);
        else
            return this.sub(new i32(1), false).flip();
    }

    sub(other, affectStatus)
    {
        // haha, just think about how this works if `other` is negative
        return this.add(other.neg(), affectStatus);
    }

    add(other, affectStatus)
    {
        if (affectStatus === undefined) affectStatus = false;

        var result = new i32();
        var carry = [0];
        for (var i = 31; i >= 0; i--)
        {
            var sum = this.bits[i] + other.bits[i] + carry[0];

            if (sum === 0 || sum === 1)
            {
                result.bits[i] = sum;
                carry.unshift(0);
            }
            else if (sum === 2 || sum === 3)
            {
                result.bits[i] = sum - 2;
                carry.unshift(1);
            }
        }

        if (affectStatus)
        {
            Emulator.utils.setStatus('N', result.bits[0]); // 0 => positive, 1 => negative
            Emulator.utils.setStatus('Z', result.zero() ? 1 : 0);
            Emulator.utils.setStatus('C', carry !== 0 ? 1 : 0);
            Emulator.utils.setStatus('V', carry[0] ^ carry[1]) // I got this from some university page
        }

        return result;
    }

    zero()
    {
        return this.dec() === 0;
    }

    bin()
    {
        return "0b" + this.bits.join("");
    }

    hex()
    {
        return "0x" + ("00000000" + parseInt(this.bin().substring(2), 2).toString(16).toUpperCase()).substr(-8);
    }

    dec(signed)
    {
        if (signed)
        {
            if (this.bits[0] === 0)
            {
                return this.dec(false);
            }
            else
            {
                return -(this.neg().dec(true));
            }
        }
        else
        {
            return parseInt(this.bin().substring(2), 2);
        }
    }
}

$(document).ready(() =>
{
    $("div#source").css("margin-left", $("div#tools").outerWidth() + 10);
});

$("div#source ul li").first().each(() =>
{

    $(this).addClass("selected");

});

Emulator.ready = () =>
{
    $("pre#src").remove();
    var tools = $("<div></div>").attr("id", "tools").appendTo("body");

    // add controls
    $("<div></div>").attr("id", "controls").appendTo(tools);
    $("div#controls").each(() =>
    {

        var self = $(this);
        var buttons = $("<div></div>").attr("id", "controlButtons").appendTo(self);

        $("<button></button>").html("Run").click(() =>
        {

            var self = $(this);
            if (self.html() == "Run")
            {
                self.html("Stop");
                Emulator.controls.run();
            }
            else
            {
                self.html("Run");
                Emulator.controls.stop();
            }

        }).appendTo(buttons);
        $("<button></button>").html("Step Once").attr("onclick", "Emulator.controls.step()").appendTo(buttons);
        $("<button></button>").html("Restart").attr("onclick", "Emulator.controls.restart()").appendTo(buttons);

        var display = $("<div></div>").attr("id", "baseDisplay").appendTo(self);

        function radioButton(text, base)
        {
            var label = $("<label>").text(text);
            var input = $("<input type='radio' name='registerBase'>");

            input.click(() =>
            {
                if ($(this).is(":checked"))
                {
                    Emulator.redraw(base);
                }
            });

            display.append(input);
            display.append(label).append("<br/>");
        }

        radioButton("Hexadecimal", 16);
        radioButton("Decimal", 10);
        radioButton("Binary", 2);
    });

    // add registers
    $("<div></div>").attr("id", "registers").appendTo(tools);
    $("div#registers").each(() =>
    {

        var self = $(this);
        var table = $("<table></table>").appendTo(self);

        for (var i = 0; i < Emulator.registerCount; i++)
        {
            var name = "r" + i;

            var header = $("<th></th>").html(name);
            var value = $("<td></td>").html("0").attr("id", name);

            Emulator.registers[i] = new i32();

            $("<tr></tr>").append(header).append(value).appendTo(table);
        }

        var test = "0b";
        for (var i = 0; i < 32; i++)
        {
            test += "0";
        }
        var row = $("<tr></tr>");
        row.append("<td></td>");
        $("<td></td>").html(test).css("visibility", "hidden").appendTo(row);
        row.appendTo(table);
    });

    // process the parsed source back into a displayable format
    var source = $("<div></div>").attr("id", "source").appendTo("body");
    var list = $("<ul></ul>").appendTo(source);

}

/* emulation */

function getRegisterObject(i)
{
    if (typeof i === "string")
    {
        return Emulator.registers[parseInt(i.substring(1))];
    }
    else
    {
        return Emulator.registers[i];
    }
}

Emulator.setRegister = function(i, val)
{
    if (val.constructor === i32)
    {
        getRegisterObject(i).copy(val);
    }
    else if (val.type !== undefined && val.type === "literal")
    {
        getRegisterObject(i).copy(i32.fromLiteral(val));
    }
    else if (typeof(val) === "number")
    {
        getRegisterObject(i).copy(new i32(val));
    }
    Emulator.redraw();
};

Emulator.getRegister = i => getRegisterObject(i)
isRegister = val => val.toLowerCase().startsWith("r")
