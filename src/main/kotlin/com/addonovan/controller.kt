package com.addonovan

interface View
{
    var onStep: () -> Unit

    fun init( program: Program, registers: RegisterFile )

    fun updateRegisters()

    fun updateLine()
}

class Controller( source: String, view: View, interpreter: Interpreter )
{

    //
    // Properties
    //

    private val program = Program( source )

    private val view = view

    private val interpreter = interpreter

    private val registers = RegisterFile()

    //
    // Constructors
    //

    init
    {
        view.init( program, registers )
        interpreter.init( program, registers )
        view.onStep = {

            interpreter.step()
            view.updateRegisters()
            view.updateLine()

        }
    }

}
