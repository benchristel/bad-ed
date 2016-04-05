"use strict";

function toArray(a) {
    var result = []
    for (var i = 0; i < a.length; i++) {
        result.push(a[i])
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
                  .pipe(insertCursor, buffer)
                  .split('\n')
                  .map(truncateToLineWidth)
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
        var includedHTML = string.match(/<[^>]+>/g)
        var totalHTMLLength

        if (includedHTML) {
            totalHTMLLength = includedHTML
                .map(s => s.length)
                .reduce((sum, length) => sum + length)
        } else {
            totalHTMLLength = 0
        }



        return string.slice(0, lineWidth + totalHTMLLength)
    }

    function insertCursor(string, buffer) {
        var before, between, after
        before = string.substring(0, buffer.selectionStart())
        between = string.substring(buffer.selectionStart(), buffer.selectionEnd())
        after = string.substring(buffer.selectionEnd(), string.length)
        return before + '<span class="cursor">' + between + '</span>' + after
    }

    return renderer
}
