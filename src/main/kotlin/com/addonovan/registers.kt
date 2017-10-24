package com.addonovan

class RegisterFile
{

    val count = 16

    /** The raw for the program */
    private val raw = Array( count, { I32() } )

    //
    // Actions
    //

    /**
     * Resets all registers to their default value (i.e. 0)
     */
    fun reset()
    {
        raw.forEachIndexed { i, _ -> 
            raw[ i ] = I32()
        }
    }

    /**
     * Runs the action on each register in the file
     */
    fun forEach( action: ( index: Int, value: I32 ) -> Unit )
    {
        raw.forEachIndexed { index, i32 ->
            action( index, i32 )
        }
    }

    //
    // Accessors
    //
    
    /** The program counter. Just an alias for r15 */
    val pc: I32
        get() = raw[ 15 ]

    operator fun get( index: Int ) = raw[ index ]
    
    operator fun get( name: String ): I32
    {
        // ensure the string makes sense
        if ( name.first() != 'r' )
            throw IllegalArgumentException( "Invalid register identifier!" )
        
        // grab the numeral from it
        return raw[ name.substring( 1 ).toInt() ]
    }

}
