"use strict";

describe('Buffer', function() {
    function render(buffer) {
        var s = spliceString(buffer.text(), buffer.selectionEnd(), ']')
        s = spliceString(s, buffer.selectionStart(), '[')
        return s
    }

    function spliceString(s, index, toInsert) {
        return s.slice(0, index) + toInsert + s.slice(index, s.length)
    }

    it('moves the cursor right', function() {
        expect(render(Buffer("hello"))).toEqual('[]hello')
        expect(render(Buffer("hello").moveRight())).toEqual('h[]ello')
    });

    it('moves the cursor left', function() {
        expect(render(
            Buffer("hello")
            .moveRight()
            .moveLeft()
        )).toEqual('[]hello')
    });

    it('does not move the cursor past the beginning of the text', function() {
        expect(render(
            Buffer("a")
            .moveLeft()
        )).toEqual('[]a')
    });

    it('does not move the cursor past the end of the text', function() {
        expect(render(
            Buffer("a")
            .moveRight()
            .moveRight()
        )).toEqual('a[]')
    });

    it('inserts in the middle of the text', function() {
        expect(render(
            Buffer("acd")
            .moveRight()
            .insert('b')
        )).toEqual('ab[]cd')
    });

    it('inserts at the end of the text', function() {
        expect(render(
            Buffer("ab")
            .moveRight()
            .moveRight()
            .insert('c')
        )).toEqual('abc[]')
    })

    it('inserts at the beginning of the text', function() {
        expect(render(
            Buffer("bc")
            .insert("a")
        )).toEqual('a[]bc')
    })

    it('inserts muliple characters', function() {
        expect(render(
            Buffer('def')
            .insert('abc')
        )).toEqual('abc[]def')
    })

    it('does nothing when inserting null', function() {
        expect(render(
            Buffer('').insert(null)
        )).toEqual('[]')
    })

    it('backspaces a character', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .backspace()
        )).toEqual('[]ello')
    })

    it('does not backspace past the beginning of the text', function() {
        expect(render(
            Buffer('hello')
            .backspace()
        )).toEqual('[]hello')
    })

    it('selects text to the right', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
        )).toEqual('[h]ello')
    })

    it('does not select text past the end', function() {
        expect(render(
            Buffer('a')
            .selectRight()
            .selectRight()
        )).toEqual('[a]')
    })

    it('selects text to the left', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .selectLeft()
        )).toEqual('[h]ello')
    })

    it('does not select text past the beginning', function() {
        expect(render(
            Buffer('hello')
            .selectLeft()
        )).toEqual('[]hello')
    })

    it('replaces selected text on insert', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
            .insert('j')
        )).toEqual('j[]ello')
    })

    it('deselects text after selecting to the right', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
            .selectLeft()
        )).toEqual('[]hello')
    })

    it('deselects text after selecting to the left', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .selectLeft()
            .selectRight()
        )).toEqual('h[]ello')
    })

    it('selects right and then left', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .selectRight()
            .selectLeft()
            .selectLeft()
        )).toEqual('[h]ello')
    })

    it('selects left and then right', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .selectLeft()
            .selectRight()
            .selectRight()
        )).toEqual('h[e]llo')
    })

    it('knows the row and column where the selection begins', function() {
        expect(Buffer('hello').selectionStartRow()).toEqual(0);
        expect(Buffer('hello').selectionStartColumn()).toEqual(0);

        var buffer = Buffer('a\nb').moveRight();
        expect(buffer.selectionStartRow()).toEqual(0);
        expect(buffer.selectionStartColumn()).toEqual(1);

        buffer = Buffer('a\nb')
            .moveRight()
            .moveRight();
        expect(buffer.selectionStartRow()).toEqual(1);
        expect(buffer.selectionStartColumn()).toEqual(0);
    })
})
