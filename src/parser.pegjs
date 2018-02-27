asm
    = i:(j:(directive / labelDefinition / instruction) __ { return j; })* {
        return i;
    }
  
//
// Directives
//

directive
    = name:(directiveName) _ arg:directiveArgument {
        return {
            type: "directive",
            name: name,
            data: arg
        };
    }
  
directiveName
    = "." name:([A-Za-z]+) {
        return name.join( "" )
    }
  
directiveArgument
    = val:(directiveLabel / directiveArray / directiveString) {
        return val;
    }
  
directiveLabel
    = val:labelName {
        return val;
    }
  
directiveArray
    = i:number __ j:("," __ k:number __ { return k; })* {
        var list = [ i ];
        for ( var i = 0; i < j.length; i++ )
        {
            list.push( j[ i ] );
        }
        return list;
    }
  
directiveString
    = '"' text:([^"]*) '"' {
        return text.join( "" );
    }
  
//
// Instructions
//

instruction
    = doubleArgInstruction
    / singleArgInstruction

doubleArgInstruction
    = op:instructionName _ arg1:argument __ "," __ arg2:argument {
        return {
            type: "instruction",
            data: {
                opcode: op,
                args: [
                    arg1,
                    arg2
                ]
            }
        }
    }

singleArgInstruction
    = op:instructionName _ arg:argument {
        return {
            type: "instruction",
            data: {
                opcode: op,
                args: [
                    arg
                ]
            }
        }
    }

argument
    = address
    / mutatedRegister
    / register
    / registerList
    / labelReference
    / immediate
    / number

instructionName
    = val:([A-Za-z]+) {
        return val.join( "" )
    }

//
// Addresses
//

address
    = postindexedAddress
    / preindexedAddress

postindexedAddress
    = "[" __ address:(register) __ "]" __ "," __ offset:immediate {
        return {
            type: "address",
            subtype: "postindexed",
            address: address.value,
            offset: offset.value
        }
    }

preindexedAddress
    = "[" __ address:(register) __ offset:("," __ val:immediate { return val; })?  __"]" {
        if ( offset !== null )
        {
            offset = offset.value;
        }
        else
        {
            offset = 0;
        }
        return {
            type: "address",
            subtype: "preindexed",
            address: address.value,
            offset: offset
        };
    }

//
// Registers
//

registerList
    = enumeratedRegisterList
    / rangedRegisterList

rangedRegisterList
    = "{" __ start:(numberedRegister) __ "-" __ end:(numberedRegister) __ "}" {
        let list = [];
        if ( start.value >= end.value ) return null;
        
        for ( var i = start.value; i <= end.value; i++ )
        {
            list.push( i );
        }
        return {
            type: "list",
            value: list
        };
    }

enumeratedRegisterList 
    = "{" __ i:(register) __ j:("," __ k:(register) __ { return k; })* "}" {
        let list = [];
        list.push( i.value );
        for ( var i = 0; i < j.length; i++ )
        {
            list.push( j[ i ].value );
        }
        // make sure that the list is always sorted least->greatest
        list = list.sort( ( a, b ) => a - b );
        return {
            type: "list",
            value: list
        };
    }

mutatedRegister
    = val:register "!" {
        val.type = "mutated-register";
        return val;
    }

register
    = numberedRegister
    / namedRegister
    
namedRegister
    = val:("sp" / "lr" / "pc") {
          return {
               type: "register",
            value: val
          }
    }
    
numberedRegister
    = "r" val:("1"[0-5] / [0-9]) {
        if ( typeof( val ) !== "string" )
        {
            val = val.join( "" );
        }
    
        return {
            type: "register",
            value: parseInt( val )
        }
    }
    
//
// Labels
//
    
labelDefinition
    = name:(labelName) ":" {
        return {
            type: "label",
            name: name
        }
    }
    
labelReference
    = "=" name:(labelName) {
        return {
            type: "label",
            name: name
        }
    }
    
labelName
    = val:([A-Za-z_][A-Za-z0-9_-]*) {
        let output = "";
        for ( let i = 0; i < val.length; i++ )
        {
            let item = val[ i ];
            if ( typeof( item ) === "string" )
            {
                output += item;
            }
            else
            {
                output += item.join( "" );
            }
        }
        return output;
    }
    
//
// Literals
//

immediate
    = "#" val:number {
        return {
            type: "literal",
            value: val
        };
    }

//
// Numbers
//

number
    = binaryNumber
    / hexadecimalNumber
    / characterNumber
    / decimalNumber

binaryNumber
    = "0b" val:([01]+) {
        return parseInt( val.join( "" ), 2 );
    }

decimalNumber
    = val:([0-9]+) {
        return parseInt( val.join( "" ) );
    }

hexadecimalNumber
    = "0x" val:([0-9A-Fa-f]+) {
        return parseInt( val.join( "" ), 16 );
    }

characterNumber
    = "'" val:("\\". / .) "'" {
        // if it's an array, that means we have an escape sequence
        // so we're just gonna let the js interpreter evaluate it
        if ( typeof( val ) !== "string" )
        {
            val = eval( "'" + val.join( "" ) + "'" );
        }
    
        return val.codePointAt( 0 );
    }

//
// Whitespace
//
    
// mandatory whitespace
_ = [ \t\r\n]+
// optional whitespace
__ = [ \t\r\n]*
