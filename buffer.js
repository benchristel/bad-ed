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
        selectionEnd = selectionStart;
    }

    if (!selectDirection && hasSelection()) {
        throw new Error('text is selected, but no selectDirection given')
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
                return Buffer(text, selectionEnd)
            } else if (cursorAtEndOfText()) {
                return self
            } else {
                return Buffer(text, selectionEnd + 1);
            }
        },

        moveLeft() {
            if (hasSelection()) {
                return Buffer(text, selectionStart);
            } else if (cursorAtBeginningOfText()) {
                 return self
            } else {
                return Buffer(text, selectionStart - 1);
            }
        },

        moveUp() {
            if (onFirstLine()) {
                return self
            }

            if (lineAboveIsShorter()) {
                return Buffer(
                    text,
                    endOfPreviousLine(),
                    endOfPreviousLine(),
                    null,
                    getTargetColumn()
                )
            } else {
                return Buffer(text, targetIndex())
            }

            function targetIndex() {
                return beginningOfPreviousLine() + getTargetColumn()
            }

            function lineAboveIsShorter() {
                return targetIndex() >= beginningOfCurrentLine()
            }

            function getTargetColumn() {
                return targetColumn || self.selectionStartColumn()
            }
        },

        insert(toInsert) {
            if (!toInsert) {
                return self;
            }

            const newCursorPosition = selectionStart + toInsert.length

            return Buffer(
                beforeCursor() + toInsert + afterCursor(),
                newCursorPosition
            )
        },

        backspace() {
            if (hasSelection()) {
                return Buffer(
                    beforeCursor() + afterCursor(),
                    selectionStart
                )
            } else if (cursorAtBeginningOfText()) {
                return self
            } else {
                return Buffer(
                    beforeCursor(-1) + afterCursor(),
                    selectionStart - 1
                )
            }
        },

        selectRight() {
            if (hasSelection() && selectingLeft()) {
                return increaseSelectionRight()
            } else if (cursorAtEndOfText()) {
                return self
            } else {
                return shrinkSelectionAtStart()
            }
        },

        selectLeft() {
            if (hasSelection() && selectingRight()) {
                return shrinkSelectionAtEnd()
            } else if (cursorAtBeginningOfText()) {
                return self
            } else {
                return increaseSelectionLeft()
            }
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
            return count('\n', textBefore(selectionStart))
        },

        selectionStartColumn() {
            return column(selectionStart - 1)
        },

        selectionEndRow() {
            return count('\n', textBefore(selectionEnd))
        },

        selectionEndColumn() {
            return column(selectionEnd - 1)
        }
    }

    /* PRIVATE METHODS */

    function shrinkSelectionAtEnd() {
        return Buffer(
            text,
            selectionStart,
            selectionEnd - 1,
            SELECT_RIGHT
        )
    }

    function shrinkSelectionAtStart() {
        return Buffer(
            text,
            selectionStart,
            selectionEnd + 1,
            SELECT_RIGHT
        )
    }

    function increaseSelectionLeft() {
        return Buffer(
            text,
            selectionStart - 1,
            selectionEnd,
            SELECT_LEFT
        )
    }

    function increaseSelectionRight() {
        return Buffer(
            text,
            selectionStart + 1,
            selectionEnd,
            SELECT_LEFT
        )
    }

    function count(character, inText) {
        return inText.split(character).length - 1
    }

    function hasSelection() {
        return selectionStart !== selectionEnd;
    }

    function selectingRight() {
        return selectDirection === SELECT_RIGHT
    }

    function selectingLeft() {
        return selectDirection === SELECT_LEFT
    }

    function beforeCursor(offset) {
        if (offset === undefined) offset = 0
        return textBefore(selectionStart + offset)
    }

    function afterCursor() {
        return text.slice(selectionEnd, text.length)
    }

    function textBefore(index) {
        return text.slice(0, index)
    }

    function column(indexIntoText) {
        return indexIntoText - text.lastIndexOf('\n', indexIntoText)
    }

    function cursorAtBeginningOfText() {
        return selectionStart === 0
    }

    function cursorAtEndOfText() {
        return selectionEnd === text.length
    }

    // METHODS TO MOVE TO CURSOR CLASS

    function onFirstLine() {
        return self.selectionStartRow() === 0
    }

    function endOfPreviousLine() {
        return beginningOfCurrentLine() - 1
    }

    function beginningOfCurrentLine() {
        return beginningOfLine(text, selectionStart)
    }

    function beginningOfPreviousLine() {
        return beginningOfLine(text, endOfPreviousLine())
    }

    function endOfPreviousLine() {
        return beginningOfCurrentLine() - 1
    }

    return self
}

function beginningOfLine(text, index) {
    return text.lastIndexOf('\n', index - 1) + 1
}
