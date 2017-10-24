package com.addonovan;

object Parser
{

    /**
     * Parses the content of the files and returns a list of lines that can be modeled
     * by the [WebView].
     */
    fun parse( content: String ): List< Line >
    {
        val raw = PegJsParser.parse( content )

        val result = ArrayList< Line >()
        var offset = 0;

        raw.forEach {

            // a label's definition
            if ( it.type == "identifier" && it.subtype == "label" )
            {
                result += Particle.Label( it.value as String )
            }
            // an instruction
            else if ( it.type == "instruction" )
            {
                // grab the opcode
                val opcode = Particle.OpCode( it.op.value as String )

                // grab the arguments
                val args = ArrayList< Argument >()
                ( it.args as Array< dynamic > ).forEach {

                    val value = it.value as String
                    when ( "${it.subtype} ${it.type}" )
                    {
                        "label identifier" -> {
                            args += Particle.Label( value )
                        }

                        "binary literal" -> {
                            args += Particle.BinaryLiteral( value )
                        }

                        "decimal literal" -> {
                            args += Particle.DecimalLiteral( value )
                        }

                        "hexadecimal literal" -> {
                            args += Particle.HexadecimalLiteral( value )
                        }

                        "register identifier" -> {
                            args += Particle.Register( value )
                        }

                        else -> {
                            console.error( "unsupported argument: ${it.subtype} ${it.type}" )
                        }
                    }

                }

                result += Particle.Instruction( offset, opcode, args )
                offset += 4
            }

        }

        return result
    }

}

//
// Particle Classes
//

/**
 * An interface to tag certain [Particle]s as possibly being arguments.
 */
interface Argument

/**
 * An interface to tag certain [Particle]s as possibly being independent lines.
 */
interface Line

/**
 * A type-safe particle from the output of the parser.
 */
sealed class Particle
{

    /**
     * An instruction, which an [OpCode] and a list of arguments.
     */
    class Instruction( val offset: Int, val op: OpCode, val args: List< Argument > ) : Particle(), Line

    /**
     * A particle denoting some kind of label literal
     */
    class Label( val value: String ) : Particle(), Argument, Line

    /**
     * A particle denoting some kind of opcode
     */
    class OpCode( val value: String ) : Particle()

    class Register( val value: String ) :Particle(), Argument

    //
    // Literals
    //

    /**
     * A particle denoting some kind of literal.
     */
    abstract class Literal( val value: String, val type: String ) : Particle(), Argument
    {
        abstract val intValue: Int

        abstract override fun toString(): String
    }

    /**
     * A binary literal
     */
    class BinaryLiteral( value: String ) : Literal( value, "binary" )
    {
        override val intValue: Int = value.toInt( 2 )

        override fun toString() = "#0b$value"
    }

    /**
     * A decimal literal
     */
    class DecimalLiteral( value: String ) : Literal( value, "decimal" )
    {
        override val intValue: Int = value.toInt()

        override fun toString() = "#$value"
    }

    /**
     * A hexadecimal literal
     */
    class HexadecimalLiteral( value: String ) : Literal( value, "hexadecimal" )
    {
        override val intValue: Int = value.toInt( 16 )

        override fun toString() = "#0x$value"
    }

    /**
     * A character literal
     */
    class CharacterLiteral( value: String ) : Literal( value, "character" )
    {
        override val intValue: Int = value.first().toInt()

        override fun toString(): String  = "#'$value'"
    }

}



//
// External Data
//

private external object PegJsParser
{
    fun parse( content: String ): Array< dynamic >
}
