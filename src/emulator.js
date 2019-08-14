'use strict';

/** Register page. Registers are accessed by their names and are read & set like members of a class. */
const reg = (function() {
	// because we are using 32-bits we can safely put everything into a 64-bit float
	// which all numbers in javascript are.
    const main = Array(17).fill(0);

    // create facade to easily access the registers by name
	// but still ensure that they're all integer values by |0'ing them
    class Register {
        get r0() { return main[0] | 0; }
        set r0(r0) { main[0] = r0 | 0; }
        get r1() { return main[1] | 0; }
        set r1(r1) { main[1] = r1 | 0; }
        get r2() { return main[2] | 0; }
        set r2(r2) { main[2] = r2 | 0; }
        get r3() { return main[3] | 0; }
        set r3(r3) { main[3] = r3 | 0; }
        get r4() { return main[4] | 0; }
        set r4(r4) { main[4] = r4 | 0; }
        get r5() { return main[5] | 0; }
        set r5(r5) { main[5] = r5 | 0; }
        get r6() { return main[6] | 0; }
        set r6(r6) { main[6] = r6 | 0; }
        get r7() { return main[7] | 0; }
        set r7(r7) { main[7] = r7 | 0; }
        get r8() { return main[8] | 0; }
        set r8(r8) { main[8] = r8 | 0; }
        get r9() { return main[9] | 0; }
        set r9(r9) { main[9] = r9 | 0; }
        get r10() { return main[10] | 0; }
        set r10(r10) { main[10] = r10 | 0; }
        get r11() { return main[11] | 0; }
        set r11(r11) { main[11] = r11 | 0; }
        get r12() { return main[12] | 0; }
        set r12(r12) { main[12] = r12 | 0; }

        get sp() { return main[13] | 0; }
        set sp(sp) { main[13] = sp | 0; }
        get lr() { return main[14] | 0; }
        set lr(lr) { main[14] = lr | 0; }
        get pc() { return main[15] | 0; }
        set pc(pc) { main[15] = pc | 0; }
        get aspr() { return main[16] | 0; }
        set aspr(aspr) { main[16] = aspr | 0; }
		
		direct(address, value) {
			address = address | 0;
			if (address < 0 || address > 16) {
				throw "RegisterAccess: Address out of range: " + address;
			}
			
			// if there's no value, then this is a get
			if (typeof(value) === "undefined") {
				return main[address];
			} else {
				main[address] = value | 0;
			}
		}
    }

    return new Register();
})();

/** Random Access memory, can be directly indexed by memory addresses just like an array. */
const mem = (function() {
	const memory = {
		//   10987654321098765432109876543210
		0: 0b00000000101000100001000000000000
	}; // {number: number} map of all memory values
	
	return new Proxy(memory, {
		get: (memory, address) => (memory[address | 0] | 0) || 0,
		set: (memory, address, value) => memory[address | 0] = value | 0
	});
})();

const pipeline = (function() {
	function combineBits(bits, start, stop) {
		var out = 0;
		for (var i = start; i < stop; i++) {
			out |= bits[i] << (i - start);
		}
		return out;
	}
	
	const instructionPatterns = [
		// each entry will decode its specific bit pattern into an executable function if it matches,
		// otherwise it will return null.
		// the first line of each checks if any of the bits are "wrong", an inverted bit will need to
		//  be on to match, an uninverted bit will need to be off.
		
		// https://www.scss.tcd.ie/~waldroj/3d1/arm_arm.pdf
		// ADD
		(bits) => {
			if (!bits[21] || bits[22] || !bits[23] || bits[24] || bits[26] || bits[27]) return;
			
			return function() {
				// dst = dst + rhs
				var dst = combineBits(bits, 12, 15);
				var rhs = combineBits(bits, 16, 19);
				var shouldUpdate = bits[20] === 1;
				
				reg.direct(dst, reg.direct(dst) + reg.direct(rhs));
			}
		},
	];
	
	/**
	 * Gets the bytes of the next instruction.
	 */
	function fetch() { 
		return mem[reg.pc]; 
	}
	
	/**
	 * Decodes the given memory instruction into an easy-to-execute object.
	 */
	function decode(instruction) {
		// decompose the number into its constituent bits for easier accessing
		const bits = Array(32);
		for (var i = 0; i < 32; i++) {
			bits[i] = (instruction >> i) & 1;
		}
		
		// go through all instruction patterns until we find a match (if any)
		for (var i = 0; i < instructionPatterns.length; i++) {
			let result = instructionPatterns[i](bits);
			if (typeof(result) === "undefined") continue;
			return result;
		}
		
		throw "Pipeline: Failed to decode instruction (" + bits.join("") + ")";
	}
	
	function execute(instruction) {
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

