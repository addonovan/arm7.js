package com.addonovan

import kotlinx.html.*
import kotlinx.html.dom.append
import kotlinx.html.js.onClickFunction
import org.w3c.dom.Document
import org.w3c.dom.Element
import org.w3c.dom.HTMLElement
import org.w3c.dom.get
import kotlin.browser.document
import kotlin.browser.window
import kotlin.dom.addClass
import kotlin.dom.removeClass

class WebView( viewport: Element ) : View
{

    //
    // Properties
    //

    override lateinit var onStep: () -> Unit

    private lateinit var registers: RegisterFile

    private var lastTimer: Int? = null
    
    //
    // Constructor
    //
    
    /**
     * Create the interface
     */
    init
    {
        while ( viewport.hasChildNodes() )
        {
            viewport.removeChild( viewport.lastChild!! )
        }

        viewport.append {
            div {
                id = "tools"

                div {
                    id = "controls"

                    button {
                        id = "step"
                    }

                    button {
                        id = "toggle-run"
                    }
                }

                div {
                    id = "raw"
                }
            }

            // transform the lines given to us into a view
            div {
                id = "source"
            }
        }
    }

    //
    // Overrides
    //

    private inline operator fun Document.get( selector: String ): HTMLElement =
            ( this.querySelector( selector )!! as HTMLElement )

    override fun init( program: Program, registers: RegisterFile )
    {
        this.registers = registers

        document[ "button#step" ].run {
            this.innerText = "Step Once"

            this.onclick = {
                onStep()

                undefined
            }
        }

        document[ "button#toggle-run" ].run {
            this.innerText = "Start"

            // toggle the timer
            this.onclick = {
                lastTimer = when( lastTimer )
                {
                    null -> {
                        this.innerText = "Stop"

                        window.setInterval( {
                            onStep()
                        }, 500 )
                    }

                    else -> {
                        this.innerText = "Start"

                        window.clearInterval( lastTimer!! )
                        null
                    }
                }

                undefined
            }

        }

        // add the register values
        document[ "div#tools div#raw" ].append {
            table {
                registers.forEach { i, i32 ->
                    tr {
                        th { text( "r$i" ) }
                        td {
                            id = "r$i"
                            text( i32.binary )
                        }
                    }
                }
            }
        }

        // add the source in
        document[ "div#source" ].append {
            fun buildArguments( args: List< Argument > )
            {
                args.forEachIndexed { i, it ->

                    span {
                        classes += "arg"

                        when ( it )
                        {
                            is Particle.Literal -> {
                                classes += "literal"
                                classes += it.type
                                text( it.toString() )
                            }

                            is Particle.Label   -> {
                                classes += "label"
                                text( it.value )
                            }

                            is Particle.Register -> {
                                classes += "register"
                                text( it.value )
                            }
                        }
                    }

                    if ( i + 1 != args.size ) span {
                        classes += "separator"
                        text( ", " )
                    }
                }
            }

            fun buildLine( line: Line ) = li {
                if ( line is Particle.Instruction )
                {
                    attributes[ "addr" ] = line.offset.toString()
                }

                span {
                    classes += "addr"

                    text( when ( line )
                    {
                        is Particle.Instruction -> "+0x${line.offset.toString( 16, 6 )}"

                        else                    -> ""
                    } )
                }

                when ( line ) {

                    is Particle.Label -> {
                        span {
                            classes += "label"
                            text( "${line.value}:" )
                        }
                    }

                    is Particle.Instruction -> {
                        span {
                            classes += "op"
                            text( line.op.value )
                        }

                        buildArguments( line.args )
                    }
                }

            }

            ul {
                program.forEachLine { buildLine( it ) }
            }
        }

        // scoot the source over
        document[ "div#source" ].setAttribute(
                "style",
                "margin-left: ${document["div#tools"].clientWidth}px"
        )

    }

    //
    // Actions
    //

    override fun updateRegisters()
    {
        registers.forEach { i, i32 ->
            document[ "#r$i" ].textContent = i32.hexadecimal
        }
    }

    override fun updateLine()
    {
        // remove all lines currently selected
        document.querySelectorAll( ".selected" ).run {

            for ( i in 0..this.length )
            {
                ( this[ i ] as? Element )?.removeClass( "selected" )
            }

        }

        // add mark this line as selected
        document.querySelector( "[addr=\"${registers.pc.value}\"]" )?.addClass( "selected" )
    }
    
}
