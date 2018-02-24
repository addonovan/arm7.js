"use strict"

const i32 = require( "../../src/memory/i32.js" );
const expect = require( "chai" ).expect;

const INT_MAX = 2147483647;
const INT_MIN = -2147483648;
const UINT_MAX = 4294967295;

describe( "i32", () => {
    describe( "constructor", () => {
        it( "should export a constructor function", () => {
            expect( i32 ).to.be.a( "function" );
        } );
    } );

    describe( "i32.from", () => {
        it( "should be a function", () => {
            expect( i32.from ).to.be.a( "function" );
        } );

        it( "should return an i32 representing the given number", () => {
            expect( i32.from( 0x00000000 ).bits.join( "" ) ).to.be
                .equal( "00000000000000000000000000000000" );
            expect( i32.from( 0x7FFFFFFF ).bits.join( "" ) ).to.be
                .equal( "01111111111111111111111111111111" );
            expect( i32.from( 0xFFFFFFFF ).bits.join( "" ) ).to.be
                .equal( "11111111111111111111111111111111" );
        } );
    } );

    describe( "signed", () => {
        it( "should not be undefined", () => {
            expect( i32.from( 0 ).signed ).to.not.be.undefined;
        } );

        it( "should return 0 for 0", () => {
            expect( i32.from( 0x00000000 ).signed ).to.be.equal( 0 );
        } );
        it( "should return INT_MAX for 0x7FFFFFFF", () => {
            expect( i32.from( 0x7FFFFFFF ).signed ).to.be.equal( INT_MAX );
        } );
        it( "should return INT_MIN for 0x80000000", () => {
            expect( i32.from( 0x80000000 ).signed ).to.be.equal( INT_MIN );
        } );
        it( "should return -1 for 0xFFFFFFFF", () => {
            expect( i32.from( 0xFFFFFFFF ).signed ).to.be.equal( -1 );
        } );
    } );

    describe( "unsigned", () => {
        it( "should not be undefined", () => {
            expect( i32.from( 0 ).signed ).to.not.be.undefined;
        } );
        it( "should return 0 for 0", () => {
            expect( i32.from( 0x00000000 ).unsigned ).to.be.equal( 0 );
        } );
        it( "should return INT_MAX for 0x7FFFFFFF", () => {
            expect( i32.from( 0x7FFFFFFF ).unsigned ).to.be.equal( INT_MAX );
        } );
        it( "should return INT_MAX + 1 for 0x80000000", () => {
            expect( i32.from( 0x80000000 ).unsigned ).to.be.equal( INT_MAX + 1 );
        } );
        it( "should return UINT_MAX for 0xFFFFFFFF", () => {
            expect( i32.from( 0xFFFFFFFF ).unsigned ).to.be.equal( UINT_MAX );
        } );
    } );

    describe( "binary", () => {
        it( "should not be undefined", () => {
            expect( i32.from( 0 ).binary ).to.not.be.undefined;
        } );
    } );

    describe( "hex", () => {
        it( "should not be undefined", () => {
            expect( i32.from( 0 ).hex ).to.not.be.undefined;
        } );
    } );

    describe( "complement", () => {
        it( "should be a function", () => {
            expect( i32.from( 0 ).complement ).to.be.a( "function" );
        } );
        it( "should not modify its receiver", () => {
            let a = i32.from( 0x0000FFFF );
            let b = i32.from( 0x0000FFFF );
            a.complement();
            expect( a.unsigned ).to.be.equal( b.unsigned );
        } );

        it( "should flip 0x00000000 to 0xFFFFFFFF", () => {
            expect( i32.from( 0x00000000 ).complement().hex )
                .to.be.equal( "0xFFFFFFFF" );
        } );
        it( "should flip 0xFFFFFFFF to 0x00000000", () => {
            expect( i32.from( 0xFFFFFFFF).complement().hex )
                .to.be.equal( "0x00000000" );
        } );
    } );

    describe( "negative", () => {
        it( "should be a function", () => {
            expect( i32.from( 0 ).negative ).to.be.a( "function" );
        } );
        it( "should not modify its receiver", () => {
            let a = i32.from( 0x0000FFFF );
            let b = i32.from( 0x0000FFFF );
            a.negative();
            expect( a.unsigned ).to.be.equal( b.unsigned );
        } );

        it( "should convert 0 to 0", () => {
            expect( i32.from( 0 ).negative().signed ).to.be.equal( 0 );
        } );
        it( "should convert 1 to -1", () => {
            expect( i32.from( 1 ).negative().signed ).to.be.equal( -1 );
        } );
        it( "should convert INT_MAX to -INT_MAX", () => {
            expect( i32.from( INT_MAX ).negative().signed ).to.be.equal( -INT_MAX );
        } );
        it( "should convert INT_MIN to INT_MIN", () => {
            expect( i32.from( INT_MIN ).negative().signed ).to.be.equal( INT_MIN );
        } );
    } );

    describe( "add", () => {
        it( "should be a function", () => {
            expect( i32.from( 0 ).add ).to.be.a( "function" );
        } );
        it( "should modify neither its receiver nor its operand", () => {
            let a = i32.from( 0x0000FFFF );
            let b = i32.from( 0x0000FFFF );
            let c = i32.from( 0xFFFF0000 );
            let d = i32.from( 0xFFFF0000 );
            a.add( c );
            expect( a.unsigned ).to.be.equal( b.unsigned );
            expect( c.unsigned ).to.be.equal( d.unsigned );
        } );

        it( "should accept a number and return correct sum", () => {
            let a = i32.from( 15 );
            expect( a.add( 5 ).unsigned ).to.be.equal( 20 );
        } );
        it( "should accept an i32 and return correct sum", () => {
            let a = i32.from( 15 );
            let b = i32.from( 5 );
            expect( a.add( b ).unsigned ).to.be.equal( 20 );
        } );

        it( "should be commutative", () => {
            let a = i32.from( Math.random() * UINT_MAX );
            let b = i32.from( Math.random() * UINT_MAX ); 
            expect( a.add( b ).unsigned ).to.be.equal( b.add( a ).unsigned );
        } );

        it( "should set overflow flag on INT_MAX + 1", () => {
            expect( i32.from( INT_MAX ).add( 1 ).overflow ).to.be.true;
        } );
        it( "should not set overflow flag for INT_MAX + -1", () => {
            expect( i32.from( INT_MAX ).add( -1 ).overflow ).to.be.false;
        } );

        it( "should set carry flag on UINT_MAX + 1", () => {
            expect( i32.from( UINT_MAX ).add( 1 ).carry ).to.be.true;
        } );
        it( "should not set carry flag on INT_MAX + 1", () => {
            expect( i32.from( INT_MAX ).add( 1 ).carry ).to.be.false;
        } );
    } );

    describe( "sub", () => {
        it( "should be a function", () => {
            expect( i32.from( 0 ).sub ).to.be.a( "function" );
        } );
        it( "should modify neither its receiver nor its operand", () => {
            let a = i32.from( 0x0000FFFF );
            let b = i32.from( 0x0000FFFF );
            let c = i32.from( 0xFFFF0000 );
            let d = i32.from( 0xFFFF0000 );
            a.sub( c );
            expect( a.unsigned ).to.be.equal( b.unsigned );
            expect( c.unsigned ).to.be.equal( d.unsigned );
        } );

        it( "should accept a number and return correct difference", () => {
            let a = i32.from( 15 );
            expect( a.sub( 5 ).unsigned ).to.be.equal( 10 );
        } );
        it( "should accept an i32 and return correct difference", () => {
            let a = i32.from( 15 );
            let b = i32.from( 5 );
            expect( a.sub( b ).unsigned ).to.be.equal( 10 );
        } );

        it( "should be negatively commutative", () => {
            let a = i32.from( Math.random() * UINT_MAX );
            let b = i32.from( Math.random() * UINT_MAX ); 
            expect( a.sub( b ).signed ).to.be.equal( -b.sub( a ).signed );
        } );

        it( "should set overflow flag on INT_MAX - -1", () => {
            expect( i32.from( INT_MAX ).sub( -1 ).overflow ).to.be.true;
        } );
        it( "should not set overflow flag for INT_MAX - 1", () => {
            expect( i32.from( INT_MAX ).sub( 1 ).overflow ).to.be.false;
        } );

        it( "should set carry flag on UINT_MAX - 1", () => {
            expect( i32.from( UINT_MAX ).sub( 1 ).carry ).to.be.true;
        } );
        it( "should not set carry flag on INT_MAX - -1", () => {
            expect( i32.from( INT_MAX ).sub( -1 ).carry ).to.be.false;
        } );
    } );

} );