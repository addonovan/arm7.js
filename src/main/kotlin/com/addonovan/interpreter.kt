package com.addonovan

class Interpreter
{
    
    //
    // Properties
    //

    private lateinit var program: Program

    private lateinit var registers: RegisterFile

    private lateinit var ops: Operations

    /** The interval variable  */
    private var interval: Int? = null

    //
    // Actions
    //

    fun init( program: Program, registers: RegisterFile )
    {
        this.program = program
        this.registers = registers
        this.ops = Operations( registers, program )
    }

    /**
     * Executes the next instruction
     */
    fun step()
    {
        // the program counter is almost always 8 bytes ahead of the current instruction
        // but for now, it'll just be the next instruction 
        val address = registers.pc.unsignedValue
        registers.pc += 4 // move to the next instruction

        val instruction: Particle.Instruction = program[ address ].let {
            if ( it !is Particle.Instruction )
            {
                throw UnsupportedOperationException( "Expected Particle.Instruction, found: ${it::class.js}" )
            }

            it
        }

        ops[ instruction.op.value ]( instruction.args )
    }
    
    
}