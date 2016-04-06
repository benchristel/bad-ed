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
        var unrenderedChars = string.length - renderedLength(string)
        return string.slice(0, lineWidth + unrenderedChars)
    }

    function renderedLength(string) {
        // returns the length of the string, in characters, when
        // rendered on the screen, taking into account that HTML
        // tags are not rendered, and HTML entities show up as
        // one character.

        var includedHTML = string.match(/<[^>]+>/g)
        var totalHTMLLength

        if (includedHTML) {
            totalHTMLLength = includedHTML
                .map(s => s.length)
                .reduce((sum, length) => sum + length)
        } else {
            totalHTMLLength = 0
        }

        var htmlEntities = string.match(/&[^&]+;/g)
        if (htmlEntities) {
            totalHTMLLength +=
                htmlEntities
                .map(s => s.length - 1)
                .reduce((sum, length) => sum + length)
        }

        return string.length - totalHTMLLength
    }

    function escapeHtml(raw) {
        return raw
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
    }

    function insertCursor(lines, buffer) {
        var before, between, after,
            selStart = buffer.selectionStart(),
            selEnd   = buffer.selectionEnd(),
            startLine, startCol,
            endLine, endCol

        var textBeforeSelStart = buffer.text().substring(0, selStart)
        var textBeforeSelEnd = buffer.text().substring(selStart, selEnd)

        startLine = count(textBeforeSelStart, '\n')

        startCol = textBeforeSelStart.length - textBeforeSelStart.lastIndexOf('\n') - 1

        endLine = count(textBeforeSelEnd, '\n')
        endCol = textBeforeSelEnd.length - textBeforeSelEnd.lastIndexOf('\n') - 1

        return escapeHtml(before)
            + '<span class="cursor">'
            + escapeHtml(between)
            + '</span>'
            + escapeHtml(after)
    }

    function count(haystack, needle) {
        haystack.split(needle).length - 1
    }

    return renderer
}
