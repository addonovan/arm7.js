package com.addonovan

class Operations( val registers: RegisterFile, val program: Program )
{

    val ops = HashMap< String, ( args: List< Argument > ) -> Unit >()

    init
    {
        ops[ "nop" ] = {
            console.warn( "Performing no op" )
        }

        ops[ "mov" ] = {
            if ( it.size != 2 ) throw IllegalArgumentException( "Expected 2 arguments, received ${it.size}" )

            val dst: Particle.Register = it[ 0 ].let {
                if ( it !is Particle.Register ) throw IllegalArgumentException( "mov#dst must be a register" )
                it
            }

            val src = it[ 1 ]
            when ( src )
            {
                // copy value from register
                is Particle.Register -> {
                    registers[ dst.value ].copy( registers[ src.value ] )
                }

                // copy value from decimal literal
                is Particle.Literal -> {
                    registers[ dst.value ].copy( src.intValue )
                }

                else -> {
                    throw IllegalArgumentException( "mov#src only accepts a register or literal" )
                }
            }
        }

        ops[ "add" ] = {
            if ( it.size < 2 ) throw IllegalArgumentException( "add must have at least 2 operands" )
            if ( it.size > 3 ) throw IllegalArgumentException( "add must have no more than 3 operands" )

            val dst = registers[ ( it[ 0 ] as Particle.Register ).value ]

            val left =
                    if ( it.size == 2 )
                        0
                    else
                        1

            val right = left + 1

            val lhs = registers[ ( it[ left ] as Particle.Register ).value ]
            val rhs = it[ right ].let {
                when ( it )
                {
                    is Particle.Register -> registers[ it.value ]
                    is Particle.Literal  -> it.intValue.toI32()
                    else                 -> throw UnsupportedOperationException( "Last parameter must be either register or literal" )
                }
            }

            dst.copy( lhs + rhs )
        }

        ops[ "bal" ] = {
            if ( it.size != 1 ) throw IllegalArgumentException( "bal can only have 1 argument" )

            val dst = it[ 0 ] as? Particle.Label ?: throw IllegalArgumentException( "bal#dst should be a label" )

            // copy the label's offset into the program counter
            registers.pc.copy( program[ dst.value ] )
        }
    }

    operator fun get( name: String ) =
            if ( name !in ops )
                ops[ "nop" ]!!
            else
                ops[ name ]!!

}
