const i32 = require( "./i32" );
const memory = require( "./memory" );
const MemoryMap = memory.MemoryMap;
const RegisterFile = memory.RegisterFile;
const Parser = require( "./parser" );
const View = require( "./view" );

class Emulator
{
    constructor( source )
    {
        this.source = source;
        this.view = new View( this, document.querySelector( "body" ) );
        this.memory = MemoryMap.create( Parser.parse( source ) );
        this.registers = new RegisterFile( ( index, old, value ) => {
            console.log( "r" + index + " changed from " + old.signed + " to " + value.signed );
        } );
    }
}
module.exports = Emulator;
