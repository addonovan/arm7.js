if (typeof Emulator === "undefined")
{
    throw new Error("Emulator has not yet been defined!");
}

Emulator.ops = {};

identifier  = x => x.type === "identifier"
register    = x => x.subtype == "register"

if (typeof Emulator.utils === "undefined")
{
    Emulator.utils = {};
}

Emulator.utils.bitCount = (i, bitCount) =>
{
    var bitCount = bitCount ? bitCount : 32;
    return '0'.repeat(bitCount-(i=i.toString(2)).length)+i;
}

Emulator.utils.fail = (msg) =>
{
    Emulator.controls.running = false;
    alert(msg);
    throw new Error(msg);
}

Emulator.utils.expect = (arg, i, type, subtype) =>
{

}

Emulator.utils.assert = (msg, expected, actual) =>
{
    if (expected !== actual) Emulator.utils.fail(msg);
}

//
// SWI
//

Emulator.ops.swi = (args) =>
{
    if (Emulator.getRegister(7).dec() === 1)
    {
        Emulator.controls.running = false;
    }
}

//
// Value copying/loading
//

Emulator.ops.mov = function(args)
{
    // type checking first
    if (!identifier(args[0]) && !register(args[0]))
    {
        Emulator.utils.fail("mov arg(0) expected register identifier");
    }

    var dst = args[0].val;

    // copy value from another register
    if (identifier(args[1]) && register(args[1]))
    {
        var src = args[1].val;

        Emulator.setRegister(dst, Emulator.getRegister(src));
    }
    else if (args[1].type === "literal")
    {
        var val = i32.fromLiteral(args[1]);
        Emulator.setRegister(dst, val);
    }
    else
    {
        Emulator.utils.fail("mov arg(1) expected literal or register identifier, found: " + args[1].type);
    }

}

Emulator.ops.mvn = function(args)
{
    if (args.length !== 1) Emulator.utils.fail
}

//
// Arithmetic
//

Emulator.ops.add = function(args)
{
    var a, b, i;

    if (args.length === 2)
    {
        i = 1;
    }
    else
    {
        i = 2;
    }

    a = Emulator.getRegister(args[i-1].val);
    b = identifier(args[i]) ? Emulator.getRegister(args[i].val) : i32.fromLiteral(args[i]);
    Emulator.getRegister(args[0].val).copy(a.add(b));
}

//
// Comparisons
//

Emulator.ops.cmp = function(args)
{
    if (args[0].type !== "identifier" || args[0].subtype !== "register")
    {
        Emulator.utils.fail("cmp arg(0) was expected to be a refister identifier, found: " + args[0].type + ": " + args[0].subtype);
    }

    var a = Emulator.getRegister(args[0].val);
    var b;

    if (args[1].type === "identifier" && args[1].subtype === "register")
    {
        b = Emulator.getRegister(args[1].val);
    }
    else if (args[1].type === "literal")
    {
        b = i32.fromLiteral(args[1]);
    }

    a.sub(b, true);
}

Emulator.utils.getStatus = () => this.bitCount(Emulator.getRegister(15).bin().substring(2), 32).substring(0, 4);
Emulator.utils.lt = () => this.getStatus()[0] === "1"
Emulator.utils.eq = () => this.getStatus()[1] === "1"
Emulator.utils.gt = () => !this.eq() && !this.lt()

Emulator.ops.bal = function(args)
{
    if (args.length !== 1)
    {
        Emulator.utils.fail("expected 1 arg, found: " + args.length);
    }

    if (args[0].type !== "identifier" || args[0].subtype !== "label")
    {
        Emulator.utils.fail("arg(0) expected identifier: label, found " + args[0].type + ": " + args[0].subtype);
    }

    var addr = Emulator.labels[args[0].id];
    Emulator.hideLine();
    Emulator.controls.offset = addr - 4; // -4 so step() will place it in the right location
}

Emulator.ops.bne = args => !Emulator.utils.eq() && Emulator.ops.bal(args)
Emulator.ops.beq = args =>  Emulator.utils.eq() && Emulator.ops.bal(args)
Emulator.ops.blt = args =>  Emulator.utils.lt() && Emulator.ops.bal(args)
Emulator.ops.bgt = args =>  Emulator.utils.gt() && Emulator.ops.bal(args)

Emulator.ops.ble = args => (Emulator.utils.lt() || Emulator.utils.eq()) && Emulator.ops.bal(args)
Emulator.ops.bge = args => (Emulator.utils.gt() || Emulator.utils.eq()) && Emulator.ops.bal(args)

