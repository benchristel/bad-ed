const SELECT_LEFT = 'left'
const SELECT_RIGHT = 'right'

function Buffer(text, selectionStart, selectionEnd, selectDirection) {
    if (selectionStart === undefined) {
        selectionStart = 0;
    }

    if (selectionEnd === undefined) {
        selectionEnd = 0;
    }

    const self = {
        moveRight() {
            if (selectionEnd === text.length) return self;
            const newPos = selectionEnd + 1

            return Buffer(text, newPos, newPos);
        },

        moveLeft() {
            if (selectionStart === 0) return self
            const newPos = selectionStart - 1

            return Buffer(text, newPos, newPos);
        },

        insert(toInsert) {
            return Buffer(
                beforeCursor() + toInsert + afterCursor(),
                selectionStart + toInsert.length,
                selectionStart + toInsert.length
            )
        },

        backspace() {
            if (selectionStart === 0) return self;

            return Buffer(
                beforeCursor(-1) + afterCursor(),
                selectionStart - 1,
                selectionStart - 1
            )
        },

        selectRight() {
            if (hasSelection() && selectDirection === SELECT_LEFT) {
                return Buffer(
                    text,
                    selectionStart + 1,
                    selectionEnd,
                    SELECT_LEFT
                )
            }

            return Buffer(
                text,
                selectionStart,
                selectionEnd + 1,
                SELECT_RIGHT
            )
        },

        selectLeft() {
            if (hasSelection() && selectDirection === SELECT_RIGHT) {
                return Buffer(
                    text,
                    selectionStart,
                    selectionEnd - 1,
                    SELECT_RIGHT
                )
            }

            if (selectionStart === 0) return self

            return Buffer(
                text,
                selectionStart - 1,
                selectionEnd,
                SELECT_LEFT
            )
        },

        text() {
            return text;
        },

        selectionStart() {
            return selectionStart;
        },

        selectionEnd() {
            return selectionEnd;
        },
    }

    function hasSelection() {
        return selectionStart !== selectionEnd;
    }

    function beforeCursor(offset) {
        if (offset === undefined) offset = 0
        return text.slice(0, selectionStart + offset)
    }

    function afterCursor() {
        return text.slice(selectionEnd, text.length)
    }

    return self
}
