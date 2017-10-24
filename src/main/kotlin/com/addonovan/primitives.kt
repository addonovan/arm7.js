package com.addonovan

// definitions of bits
typealias Bit = Byte;

fun Int.toBit() = this.toByte()

fun Boolean.toBit() =
        when ( this )
        {
            true    -> 1.toBit()
            false   -> 0.toBit()
        }

/**
 * An abstraction of the bit array, in case the definition of
 * a bit ever changes
 */
open class BitArray
{

    /** the backing bits */
    private val bits = Array< Bit >( 32, { 0 } )

    //
    // Actions
    //
    
    fun copy( other: BitArray )
    {
        bits.forEachIndexed { index, _ -> 
            bits[ index ] = other.bits[ index ]
        }
    }
    
    //
    // operators
    //

    /**
     * @return if the given bit is on or off
     */
    operator fun get( index: Int ): Boolean
    {
        if ( index > bits.size )
        {
            console.warn( "i32.get: $index > ${bits.size}!" )
            return false
        }

        return bits[ index ] != 0.toBit()
    }

    /**
     * Marks the given bit as on or off.
     */
    operator fun set( index: Int, value: Boolean )
    {
        if ( index > bits.size )
        {
            console.warn( "i32.set: $index > ${bits.size}!" )
        }

        bits[ index ] = value.toBit()
    }

    operator fun set( index: Int, value: Bit )
    {
        this[ index ] = value != 0.toBit()
    }

}

/**
 * A bit array interpreted as a 32 bit int
 */
class I32 : BitArray()
{

    //
    // Properties
    //

    /** A binary string representing this i32 */
    val binary: String
        get()
        {
            var string = ""

            ( 0..31 ).forEach {
                string +=
                        when ( this[ it ] )
                        {
                            true    -> "1"
                            false   -> "0"
                        }
            }

            return string
        }

    /** A string representing this i32 as a hexadecimal */
    val hexadecimal: String
        get()
        {
            return unsignedValue.toString( 16 ).toUpperCase()
        }

    /** The signed value of this i32 */
    val value: Int
        get()
        {
            return binary.toLong( 2 ).toInt()
        }

    /** The unsigned value of this i32 */
    val unsignedValue: Int
        get()
        {
            return binary.toLong( 2 ).toInt()
        }

    //
    // Arithmetic
    //

    /**
     * Flips all of the bits in this i32.
     */
    fun flip(): I32
    {
        val out = I32()

        ( 0..31 ).forEach {
            out[ it ] = !this[ it ]
        }

        return out
    }

    /**
     * Copies the bit pattern from the other int into this I32
     */
    fun copy( other: Int )
    {
        copy( other.toI32() )
    }

    /**
     * Adds these two i32 and returns the result as a new i32.
     */
    operator fun plus( other: I32 ): I32
    {
        val result = I32()

        val carries = arrayListOf( 0.toBit() )
        ( 31 downTo 0 ).forEach {

            val tmp = this[ it ].toBit() + other[ it ].toBit() + carries[ 0 ]

            // result will be:
            // 0bxy
            // y will be the result at this index
            // x will denote the carry bit

            result[ it ] =  tmp.and( 0b01 ).toBit()
            carries.add( 0, tmp.and( 0b10 ).shr( 1 ).toBit() )
        }

        // TODO affect status register

        return result
    }
    operator fun plus( other: Int ) = this + other.toI32()
    operator fun minus( other: I32 ) = this + ( -other )
    operator fun minus( other: Int ) = this + ( -other.toI32() )
    
    operator fun plusAssign( other: Int ) = copy( this + other )
    operator fun plusAssign( other: I32 ) = copy( this + other )
    operator fun minusAssign( other: Int ) = copy( this - other )
    operator fun minusAssign( other: I32 ) = copy( this - other )

    /**
     * Performs 2's complement
     */
    operator fun unaryMinus() = this.flip() + 1.toI32()

}

fun Int.toI32(): I32
{
    val out = I32()

    this.toString( 2, 32 ).forEachIndexed { i, c ->
        out[ i ] = c != '0'
    }

    return out
}

fun Int.toString( radix: Int, width: Int = -1 ) =
        if ( width <= 0 )
            eval( "$this..toString( $radix )" ).toString()
        else
            eval( "(Array($width + 1).join('0') + $this..toString( $radix ) ).substr( -$width )" )
                    .toString()
                    .toUpperCase()
