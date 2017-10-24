package com.addonovan


class Program( source: String )
{

    //
    // Properties
    //

    private val lines: List< Line > = Parser.parse( source )

    private val map = ArrayList< Any? >()

    private val labels = HashMap< String, Int >()

    //
    // Constructor
    //

    init
    {

        // add all of the lines to the beginning of the program's memory
        var offset = 0
        lines.forEach {
            when ( it )
            {
                is Particle.Instruction -> {
                    // add the instruction and write nulls to the next 3 bytes (make sure all instructions
                    // are word-aligned)
                    map.add( it )
                    map.add( null )
                    map.add( null )
                    map.add( null )
                    offset += 4
                }

                is Particle.Label -> {
                    labels[ it.value ] = offset
                }

                else -> {
                    throw UnsupportedOperationException( "Unsupported line: ${it::class.js}" )
                }
            }
        }
    }

    //
    // Actions
    //

    /**
     * Performs the action on each line in the program (note: this should be used for
     * dealing with the source, not execution)
     *
     * @param[action]
     *          The action to perform.
     */
    fun forEachLine( action: ( Line ) -> Unit ) =
            lines.forEach { action( it ) }

    //
    // Operators
    //


    operator fun get( offset: Long ): Any = this[ offset.toInt() ]
    operator fun get( offset: Int ): Any =
            map[ offset ] ?: throw UnsupportedOperationException( "Offset is not word aligned (or instructions are unaligned!)" )

    operator fun get( label: String ): Int =
            labels[ label ] ?: throw IllegalArgumentException( "No label exists with the name: $label" )

}
