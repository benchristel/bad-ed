"use strict";

function toArray(a) {
    var result = new Array(a.length)
    for (var i = 0; i < a.length; i++) {
        result[i] = a[i]
    }
    return result
}

Object.prototype.pipe = function(fn) {
    var args = toArray(arguments)
    args.splice(0, 1, this)
    return fn.apply(this, args)
}

var Renderer = function(
        lineWidth,
        screenHeight,
        horizontalScrollSensitivity,
        verticalScrollSensitivity
        ) {

    var renderer = function(buffer) {
        return {
            html: function() {
                return buffer
                  .text()
                  .split('\n')
                  .map(truncateToLineWidth)
                  // TODO: truncate to screen height
                  .pipe(insertCursor, buffer)
                  .join('\n')
            }
        }
    }

    renderer.setLineWidth = function(lineWidth) {
        return Renderer(
            lineWidth,
            screenHeight,
            horizontalScrollSensitivity,
            verticalScrollSensitivity
            )
    }

    renderer.setScreenHeight = function(screenHeight) {
        return Renderer(
            lineWidth,
            screenHeight,
            horizontalScrollSensitivity,
            verticalScrollSensitivity
            )
    }

    renderer.setHorizontalScrollSensitivity = function(horizontalScrollSensitivity) {
        return Renderer(
            lineWidth,
            screenHeight,
            horizontalScrollSensitivity,
            verticalScrollSensitivity
            )
    }

    renderer.setVerticalScrollSensitivity = function(verticalScrollSensitivity) {
        return Renderer(
            lineWidth,
            screenHeight,
            horizontalScrollSensitivity,
            verticalScrollSensitivity
            )
    }

    function truncateToLineWidth(string) {
        return string.slice(0, lineWidth)
    }

    function escapeHtml(raw) {
        return raw
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
    }

    function insertCursor(lines, buffer) {
        const
            startRow = buffer.selectionStartRow(),
            startCol = buffer.selectionStartColumn(),
            endRow   = buffer.selectionEndRow(),
            endCol   = buffer.selectionEndColumn(),
            lineWithCursorStart = lines[startRow],
            lineWithCursorEnd   = lines[endRow],
            before  = lineWithCursorStart.slice(0, startCol),
            after = lineWithCursorStart.slice(startCol, lineWithCursorStart.length),
            linesCopy = toArray(lines.map(escapeHtml)),
            cursorInView = startCol <= lineWithCursorStart.length

        if (cursorInView) {
            if (startRow !== endRow) {
                linesCopy[endRow]
                    = escapeHtml(lineWithCursorEnd.slice(0, endCol))
                    + '</span>'
                    + escapeHtml(lineWithCursorEnd.slice(endCol,lineWithCursorEnd.length))

                linesCopy[startRow] = escapeHtml(before)
                    + '<span class="cursor">'
                    + escapeHtml(after)
            } else {
                linesCopy[startRow]
                    = escapeHtml(lineWithCursorStart.slice(0, startCol))
                    + '<span class="cursor">'
                    + escapeHtml(lineWithCursorStart.slice(startCol, endCol))
                    + '</span>'
                    + escapeHtml(lineWithCursorStart.slice(endCol))
            }
        }

        return linesCopy
    }

    function count(haystack, needle) {
        haystack.split(needle).length - 1
    }

    return renderer
}
