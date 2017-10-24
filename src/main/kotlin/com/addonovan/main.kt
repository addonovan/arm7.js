package com.addonovan

import kotlin.browser.document

fun find( selector: String ) = document.querySelector( selector )

fun main( args: Array< String > )
{
    val source: String = find( "pre#src" )!!.let {
        it.remove()
        it.textContent!!
    }

    val controller = Controller( source, WebView( document.body!! ), Interpreter() )
}
