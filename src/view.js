const i32 = require( "./i32" );
const Emulator = require( "./emulator" );

class View {

    /**
     * Creates a view which will display everything to the user.
     * 
     * @param {Emulator} emulator The emulator we're displaying
     * @param {HTMLBodyElement} target The target div to render to.
     */
    constructor( emulator, target )
    {
        self.emulator = emulator;
        self.target = target;
        target.innerHTML = "aaaaa";
    }

    onRegisterUpdate()
    {

    }

}
module.exports = View;
