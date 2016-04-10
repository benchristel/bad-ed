const SELECT_LEFT = 'left'
const SELECT_RIGHT = 'right'

function Buffer(text,
                selectionStart,
                selectionEnd,
                selectDirection,
                targetColumn) {

    if (selectionStart === undefined) {
        selectionStart = 0;
    }

    if (selectionEnd === undefined) {
        selectionEnd = 0;
    }

    if (selectionStart > selectionEnd) {
        throw new Error('selectionStart must not be greater than selectionEnd')
    }

    if (selectionStart < 0) {
        throw new Error('selectionStart must be >= 0')
    }

    const self = {
        moveRight() {
            if (hasSelection()) {
                return Buffer(text, selectionEnd, selectionEnd);
            } else {
                if (selectionEnd === text.length) return self;
                const newPos = selectionEnd + 1

                return Buffer(text, newPos, newPos);
            }
        },

        moveLeft() {
            if (hasSelection()) {
                return Buffer(text, selectionStart, selectionStart);
            } else {
                if (selectionStart === 0) return self
                const newPos = selectionStart - 1

                return Buffer(text, newPos, newPos);
            }

        },

        moveUp() {
            if (self.selectionStartRow() === 0) {
                return self
            }

            const beginningOfCurrentLine =
                beginningOfLine(text, selectionStart),

                beginningOfPreviousLine =
                beginningOfLine(text, beginningOfCurrentLine - 1)

            const newTargetColumn = targetColumn || self.selectionStartColumn()
            const newPos = beginningOfPreviousLine + newTargetColumn

            if (newPos >= beginningOfCurrentLine) {
                return Buffer(text, beginningOfCurrentLine - 1, beginningOfCurrentLine - 1, null, newTargetColumn)
            } else {
                return Buffer(text, newPos, newPos)
            }
        },

        insert(toInsert) {
            if (!toInsert) {
                return self;
            }

            return Buffer(
                beforeCursor() + toInsert + afterCursor(),
                selectionStart + toInsert.length,
                selectionStart + toInsert.length
            )
        },

        backspace() {
            if (hasSelection()) {
                return Buffer(
                    beforeCursor() + afterCursor(),
                    selectionStart,
                    selectionStart
                )
            } else if (selectionStart === 0) {
                return self
            } else {
                return Buffer(
                    beforeCursor(-1) + afterCursor(),
                    selectionStart - 1,
                    selectionStart - 1
                )
            }
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

        selectionStartRow() {
            return count(text.slice(0, selectionStart), '\n')
        },

        selectionStartColumn() {
            const indexBeforeSelection = selectionStart - 1

            return indexBeforeSelection
                - text.lastIndexOf('\n', indexBeforeSelection);
        },

        selectionEndRow() {
            return count(text.slice(0, selectionEnd), '\n')
        },

        selectionEndColumn() {
            const indexBeforeSelectionEnd = selectionEnd - 1

            return indexBeforeSelectionEnd
                - text.lastIndexOf('\n', indexBeforeSelectionEnd);
        }
    }

    function count(inText, character) {
        return inText.split(character).length - 1
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

function beginningOfLine(text, index) {
    return text.lastIndexOf('\n', index - 1) + 1
}
