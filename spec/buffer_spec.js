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

    it('blows up if the selection ends before it begins', function() {
        expect(() => Buffer('', 2, 1)).toThrowError()
    })

    it('blows up if the selection starts at a negative index', function() {
        expect(() => Buffer('', -1, 1)).toThrowError()
    })

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

    it('deletes selected text on backspace', function() {
        expect(render(
            Buffer('boaot')
            .moveRight()
            .moveRight()
            .moveRight()
            .selectRight()
            .backspace()
        )).toEqual('boa[]t')
    })

    it('deletes selected text when the selection begins the document', function() {
        expect(render(
            Buffer('boaot')
            .selectRight()
            .backspace()
        )).toEqual('[]oaot')
    })

    it('incrementally deselects text selected to the right', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
            .selectLeft()
        )).toEqual('[]hello')
    })

    it('incrementally deselects text selected to the left', function() {
        expect(render(
            Buffer('hello')
            .moveRight()
            .selectLeft()
            .selectRight()
        )).toEqual('h[]ello')
    })

    it('deselects on move left', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
            .moveLeft()
        )).toEqual('[]hello')
    })

    it('deselects on move right', function() {
        expect(render(
            Buffer('hello')
            .selectRight()
            .moveRight()
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

    it('knows the row and column where the selection ends', function() {
        expect(Buffer('hello').selectionStartRow()).toEqual(0);
        expect(Buffer('hello').selectionStartColumn()).toEqual(0);

        var buffer = Buffer('a\nb').selectRight();
        expect(buffer.selectionEndRow()).toEqual(0);
        expect(buffer.selectionEndColumn()).toEqual(1);

        buffer = Buffer('a\nb')
            .selectRight()
            .selectRight();
        expect(buffer.selectionEndRow()).toEqual(1);
        expect(buffer.selectionEndColumn()).toEqual(0);
    })

    it('moves the cursor up one line', function() {
        expect(render(
            Buffer('\nab\ncd', 5, 5)
            .moveUp()
        )).toEqual('\na[]b\ncd')
    })

    it('moves the cursor up one line, when the previous line is shorter than the current one', function() {
        expect(render(
            Buffer('\n1\n34', 5, 5)
            .moveUp()
        )).toEqual('\n1[]\n34')
    })

    it('moves the cursor up, past a short line to a long one', function() {
        expect(render(
            Buffer('\n12\n4\n67', 8, 8)
            .moveUp()
            .moveUp()
        )).toEqual('\n12[]\n4\n67')
    })

    it('moves the cursor up, past alternating long and short lines', function() {
        expect(render(
            Buffer('\n123\n5\n789\n12', 13, 13)
            .moveUp()
            .moveUp()
            .moveUp()
        )).toEqual('\n12[]3\n5\n789\n12')
    })

    it('moves the cursor up, past alternating long and short lines', function() {
        expect(render(
            Buffer('\n123\n5\n789\n12', 13, 13)
            .moveUp()
            .moveUp()
            .moveUp()
        )).toEqual('\n12[]3\n5\n789\n12')
    })

    it('moves the cursor up, past two successively-shorter lines', function() {
        expect(render(
            Buffer('\n123\n\n6\n89', 10, 10)
            .moveUp()
            .moveUp()
            .moveUp()
        )).toEqual('\n12[]3\n\n6\n89')
    })

    it('does not move the cursor past the beginning of the text', function() {
        expect(render(
            Buffer('')
            .moveUp()
        )).toEqual('[]')
    })
})

describe('beginningOfLine', function() {
    it('finds the beginning of the line containing an index', function() {
        const text = '0123\n5678'
        expect(beginningOfLine(text, 6)).toEqual(5)
        expect(beginningOfLine(text, 5)).toEqual(5)
        expect(beginningOfLine(text, 4)).toEqual(0)
    })
})
