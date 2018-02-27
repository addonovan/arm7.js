const i32 = require( "./i32" );

//
// MemoryMap
//

const MemoryMapInitializer = {
    "instruction": ( map, line ) => {

        // add the instruction into the map at the current position
        map.instructions[ map.offset ] = line.data;

        // each instruction is 4 bytes long (32 bits)
        map.offset += 4;
    },

    "label": ( map, line ) => {
        // insert the label, don't touch the offset though
        map.labels[ line.data ] = map.offset;
    },

    "directive": ( map, line ) => {
        switch ( line.name )
        {
            case ".global":
                if ( typeof( line.data ) !== "string" )
                {
                    throw ".global must be followed by a label name"
                }
                map.metadata[ ".global" ] = line.data;
                break;
            
            default:
                throw "Unrecognized or unsupported directive: " + line.name;
                break;
        }
    },
};

class MemoryMap
{
    constructor()
    {
        this.offset = 0;
        this.labels = {};       // String -> Offset
        this.instructions = {}; // Offset -> Instruction
        this.data = {};         // Offset -> i32
        this.metadata = {};     // String -> {}
    }

    /**
     * Creates a new memory map from the given parser output.
     * 
     * @param {[ParsedLines]} lines The output from the parser.
     */
    static create( lines )
    {
        let map = new MemoryMap();

        for ( let i = 0; i < lines.length; i++ )
        {
            let line = lines[ i ];
            MemoryMapInitializer[ line.type ]( map, line );
        }
    }

};
module.exports.MemoryMap = MemoryMap;

//
// RegisterFile
//

// how many registers are in a register file?
const REGISTER_COUNT = 16;

// special bit names for the status register
const BIT_N = 31;
const BIT_Z = 30;
const BIT_C = 29;
const BIT_V = 28;

// special register indices
const SP_INDEX = 13;
const PC_INDEX = 15;
const LR_INDEX = 14;
const ASPR_INDEX = 15;

/** 
 * The integer register file for a process.
 */
class RegisterFile
{
    /**
     * @param {function(number, i32, i32)} onValueChange Callback fired when a register value changes.
     */
    constructor( onValueChange )
    {
        this.onValueChange = onValueChange;

        // initialize all the registers
        this.registers = [];
        for ( let i = 0; i < REGISTER_COUNT; i++ )
        {
            this.registers[ i ] = i32.from( 0 );
        }
    }

    /**
     * Returns the i32 for the register.
     * 
     * @param {number} index The index of the register [0, REGISTER_COUNT).
     */
    get( index )
    {
        index |= 0;
        if ( index < 0 || index >= REGISTER_COUNT ) 
        {
            throw "IllegalRegisterIndex: " + index;
        }

        // i32s are immutable, so no need for a copy
        return this.registers[ index ];
    }

    /**
     * Sets the given register to the value provided.
     * 
     * @param {number} index The index of the register [0, REGISTER_COUNT).
     * @param {number|i32} value The value to update the register to.
     */
    set( index, value )
    {
        index |= 0;
        if ( index < 0 || index >= REGISTER_COUNT )
        {
            throw "IllegalRegisterIndex: " + index;
        }

        if ( typeof( value ) === "number" )
        {
            value = i32.from( value );   
        }

        let old = this.registers[ index ];
        this.registers[ index ] = value;

        // call the callback
        this.onValueChange( index, old, value );
    }

    /**
     * Sets the status register's NZCV bits to reflect the given flags. These flags
     * can be obtained from the `flags` property of an `i32` which was generated
     * by arithmetic operations.
     * 
     * @param {{negative: boolean, zero: boolean, carry: boolean, overflow: boolean}} flags 
     */
    set status( flags )
    {
        let statusRegister = this.aspr.copy();
        statusRegister.bits[ BIT_N ] = flags.negative   ? 1 : 0;
        statusRegister.bits[ BIT_Z ] = flags.zero       ? 1 : 0;
        statusRegister.bits[ BIT_C ] = flags.carry      ? 1 : 0;
        statusRegister.bits[ BIT_V ] = flags.overflow   ? 1 : 0;
        this.aspr = statusRegister;
    }

    /**
     * @return {{negative: boolean, zero: boolean, carry: boolean, overflow: boolean}}
     */
    get status()
    {
        let statusRegister = this.aspr;
        return {
            negative:   statusRegister.bits[ BIT_N ] === 1,
            zero:       statusRegister.bits[ BIT_Z ] === 1,
            carry:      statusRegister.bits[ BIT_C ] === 1,
            overflow:   statusRegister.bits[ BIT_V ] === 1,
        };
    }

    //
    // Special Register names
    //

    /**
     * Stack Pointer
     */
    get sp()
    {
        return this.get( SP_INDEX );
    }

    set sp( value )
    {
        this.set( SP_INDEX, value );
    }

    /**
     * Link Register
     */
    get lr()
    {
        return this.get( LR_INDEX );
    }

    set lr( value )
    {
        this.set( LR_INDEX, value );
    }

    /**
     * Program Counter
     */
    get pc()
    {
        return this.get( PC_INDEX );
    }

    set pc( value )
    {
        this.set( PC_INDEX, value );
    }

    /**
     * Active Program Status Register (aka Status Register)
     */
    get aspr()
    {
        return this.get( ASPR_INDEX );
    }

    set aspr( value )
    {
        this.set( ASPR_INDEX, value );
    }

}
module.exports.RegisterFile = RegisterFile;
