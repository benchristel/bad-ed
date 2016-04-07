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
            row = buffer.selectionStartRow(),
            col = buffer.selectionStartColumn(),
            lineWithCursor = lines[row],
            before = lineWithCursor.slice(0, col),
            after  = lineWithCursor.slice(col, lineWithCursor.length),
            linesCopy = toArray(lines.map(escapeHtml)),
            cursorInView = col <= lineWithCursor.length

        if (cursorInView) {
            linesCopy[row] = escapeHtml(before)
                + '<span class="cursor"></span>'
                + escapeHtml(after)
        }

        return linesCopy
    }

    function count(haystack, needle) {
        haystack.split(needle).length - 1
    }

    return renderer
}
