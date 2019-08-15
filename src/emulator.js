'use strict';

/** Register page. Registers are accessed by their names and are read & set like members of a class. */
const reg = (function() {
    // because we are using 32-bits we can safely put everything into a 64-bit float
    // which all numbers in javascript are.
    const main = new Uint32Array(17);
    
    // create facade to easily access the registers by name
    class Register {
        get r0() { return main[0]; }
        set r0(r0) { main[0] = r0; }
        get r1() { return main[1]; }
        set r1(r1) { main[1] = r1; }
        get r2() { return main[2]; }
        set r2(r2) { main[2] = r2; }
        get r3() { return main[3]; }
        set r3(r3) { main[3] = r3; }
        get r4() { return main[4]; }
        set r4(r4) { main[4] = r4; }
        get r5() { return main[5]; }
        set r5(r5) { main[5] = r5; }
        get r6() { return main[6]; }
        set r6(r6) { main[6] = r6; }
        get r7() { return main[7]; }
        set r7(r7) { main[7] = r7; }
        get r8() { return main[8]; }
        set r8(r8) { main[8] = r8; }
        get r9() { return main[9]; }
        set r9(r9) { main[9] = r9; }
        get r10() { return main[10]; }
        set r10(r10) { main[10] = r10; }
        get r11() { return main[11]; }
        set r11(r11) { main[11] = r11; }
        get r12() { return main[12]; }
        set r12(r12) { main[12] = r12; }

        get sp() { return main[13]; }
        set sp(sp) { main[13] = sp; }
        get lr() { return main[14]; }
        set lr(lr) { main[14] = lr; }
        get pc() { return main[15]; }
        set pc(pc) { main[15] = pc; }
        get aspr() { return main[16]; }
        set aspr(aspr) { main[16] = aspr; }
        
        direct(address, value) {
            address = address >>> 0;
            if (address < 0 || address > 16) {
                throw "RegisterAccess: Address out of range: " + address;
            }
            
            // if there's no value, then this is a get
            if (typeof(value) === "undefined") {
                return main[address];
            } else {
                main[address] = value;
            }
        }
    }

    return new Register();
})();

/** Random Access memory, can be directly indexed by memory addresses just like an array. */
const mem = (function() {
    const memory = {
        //   10987654321098765432109876543210
        0: 0b00000000100000100001000000000000,
        1: 0b00001010000000000000000000000000
    }; // {number: number} map of all memory values
    
    return new Proxy(memory, {
        get: (memory, address) => {
            if (address === "maxAddress") {
                return Math.max(...Object.keys(memory));
            } else if (address === "keys") {
                return Object.keys(memory);
            }
            
            return (memory[address >>> 0] >>> 0) || 0;
        },
        set: (memory, address, value) => memory[address >>> 0] = value >>> 0
    });
})();

const pipeline = (function() {
    
    /**
     * Gets the bytes of the next instruction.
     */
    function fetch() { 
        return mem[reg.pc]; 
    }
    
    function decode(word) {
        let bits = utils.splitToBits(word);
        return instruction.decodeToAction(bits);
    }
    
    function execute(instruction) {
        reg.pc++;
        instruction();
    }
    
    function pump() {
        let result = execute(decode(fetch()));
    }

    function flush() {
        // do nothing (for now)
    }

    return {
        flush: flush,
        pump: pump
    };
})();

const display = (function() {
    
    function updateInstructionOverview() {
        function displayBits(word, instruction) {
            // process the instruction to label each bit with a selector
            // and match each argument name to a color
            let scheme = utils.getColorScheme();
            let bits = Array(32).fill(null);
            let colors = {};
            
            for (let argumentName in instruction.bits) {
                if (!(argumentName in colors)) {
                    colors[argumentName] = scheme.shift();
                }
                
                let value = instruction.bits[argumentName];
                if (typeof(value) === "number") {
                    bits[value] = argumentName;
                } else if (typeof(value) === "object") {
                    for (let i = value.start; i <= value.stop; i++) {
                        bits[i] = argumentName;
                    }
                }
            }
            
            // now generate all of the spans for the bits
            let html = "";
            for (let i = 31; i >= 0; i--) {
                let name = bits[i];
                let color = colors[name];
                let bit = word[i];
                html += "<span class='instr bit " + name + "' style='color:" + color + ";'>" + bit + "</span>";
            }
            
            // generate colors for each of these argument names
            document.querySelector("#instruction").innerHTML = html;
            
            // return the color scheme this instruction is using
            return colors;
        }
        
        function displaySchemeKey(colorScheme) {
            var html = "<ul>";
            for (let name in colorScheme) {
                let color = colorScheme[name];
                // give an actual name to the identity
                let displayName = name === "null" ? "identity" : name;
                html += "<li class='" + name + "' style='color:" + color + ";'>" + displayName + "</li>";
            }
            html += "</ul>";
            
            document.querySelector("#instructionColorKey").innerHTML = html;
        }
        
        var word = utils.splitToBits(mem[reg.pc]);
        var instr = instruction.decode(word);
        displaySchemeKey(displayBits(word, instr));
    }
    
    function updateRegisters() {
        var registerNames = {
            13: "sp",
            14: "lr",
            15: "pc",
            16: "aspr"
        };
        
        let html = "<table><tr><th>Register</th><th>Value</th></tr>";
        for (let i = 0; i < 17; i++) {
            let name = i in registerNames ? registerNames[i] : "r" + i;
            let value = utils.splitToBits(reg.direct(i)).reverse().join("");
            html += "<tr><td class='register name'>" + name + "</td>" + 
                    "<td class='register value'>" + value + "</td></tr>";
        }
        html += "</table>"
        
        document.querySelector("#registers").innerHTML = html;
    }
    
    function updateMemory() {
        function createRow(address, value) {
            var row = document.createElement("tr");
            
            var addressElement = document.createElement("td");
            addressElement.appendChild(document.createTextNode(address));
            row.appendChild(addressElement);
            
            var valueElement = document.createElement("td");
            valueElement.appendChild(document.createTextNode(value));
            row.appendChild(valueElement);
            
            return row;
        }
        
        var memory = document.querySelector("#memory");
        while (memory.firstChild) memory.removeChild(memory.firstChild);
        
        var table = document.createElement("table");
        table.innerHTML = "<tr><th>Address</th><th>Value</th></tr>";
        memory.appendChild(table);
        
        let lastKey = -1;
        for (let key of mem.keys) {
            key = parseInt(key);
            
            // if there was a gap between addresses, put the spacing indicator
            if (key - 1 !== lastKey) {
                table.appendChild(createRow("...", "..."));
            }
            lastKey = key;
            
            let address = utils.toHexString(key);
            let value = utils.toBinaryString(mem[key]);
            table.appendChild(createRow(address, value));
        }
    }
    
    return {
        update: function() {
            updateInstructionOverview();
            updateRegisters();
            updateMemory();
        }
    };
})();

const instruction = (function() {
    // https://www.scss.tcd.ie/~waldroj/3d1/arm_arm.pdf
    const ops = [
        {
            name: "Add",
            bits: {
                null: {21: 0, 22: 0, 23: 1, 24: 0, 26: 0, 27: 0},
                "shifter": {start: 0, stop: 11},
                "Rd": {start: 12, stop: 15},
                "Rn": {start: 16, stop: 19},
                "S": 20,
                "I": 25,
                "cond": {start: 28, stop: 31}
            },
            action: function(values) {
                var rhs = reg.direct(values.Rd);
                var lhs = reg.direct(values.Rn);
                
                reg.direct(values.Rd, rhs + lhs);
            }
        },
        {
            name: "Branch",
            bits: {
                null: {25: 1, 26: 0, 27: 1},
                "signed_immed_24": {start: 0, stop: 23},
                "L": 24,
                "cond": {start: 28, stop: 31}
            },
            action: function(values) {
                if (values.L === 1) {
                    reg.lr = reg.pc;
                }
                reg.pc = reg.signed_immed_24;
            }
        }
    ];

    function findOperation(bits) {
        let matched = ops.find(function(element) {
            // if any of the bits from the constant part of the pattern
            // do not match, then invalidate this operation pattern
            let pattern = element.bits[null];
            for (let index in pattern) {
                if (bits[index] !== pattern[index]) {
                    return false;
                }
            }
            return true;
        });
        
        // if we didn't match a bit pattern, then that's a problem
        if (typeof(matched) === "undefined") {
            throw "InstructionError: Could not match bit pattern: " + bits.reverse().join("");
        }
        
        return matched;
    }
    
    function decodeBits(bits) {
        let matched = findOperation(bits);
        
        // generate the values from the rest of the operation
        var values = {};
        for (let varName in matched.bits) {
            if (varName === null) continue;
            
            // if value is a single bit, just save that one
            var value = matched.bits[varName];
            if (typeof(value) === "number") {
                values[varName] = bits[value];
            } else if (typeof(value) === "object") {
                values[varName] = utils.combineBits(bits, value.start, value.stop);
            } else {
                throw "InstructionError: Invalid operation bit";
            }
        }
        
        return () => matched.action(values);
    }
    
    return {
        decode: findOperation,
        decodeToAction: decodeBits
    };
})();

const utils = (function() {
    function splitToBits(word) {
        let bits = Array(32);
        for (let i = 0; i < 32; i++) {
            bits[i] = (word >> i) & 1;
        }
        return bits;
    }
    
    function combineBits(bits, start, stop) {
        let out = 0;
        for (let i = start; i <= stop; i++) {
            out |= bits[i] << (i - start);
        }
        return out;
    }
    
    function toBinaryString(word) {
        var padded = "00000000000000000000000000000000" + word.toString(2);
        var stripped = padded.substring(padded.length - 32);
        return "0b" + stripped;
    }
    
    function toHexString(word) {
        var padded = "00000000" + word.toString(16).toUpperCase();
        var stripped = padded.substring(padded.length - 8);
        return "0x" + stripped;
    }
    
    function getColorScheme() {
        return [
            "#bf0d3e", 
            "#00205b",
            "#b58900",
            "#cb4b16",
            "#d30102",
            "#6c71c4",
            "#268bd2",
            "#2aa198",
            "#859900"
        ];
    }
    
    return {
        splitToBits,
        combineBits,
        toBinaryString,
        toHexString,
        getColorScheme
    };
})();

