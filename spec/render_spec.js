"use strict";

describe("rendering", function() {
    var renderer = Renderer()
      .setLineWidth(80)
      .setScreenHeight(28)
      .setHorizontalScrollSensitivity(5)
      .setVerticalScrollSensitivity(5)

    it("converts a buffer into html", function() {
        var buffer = Buffer('hello')

        var rendered = renderer(buffer)
        expect(rendered.html()).toEqual('<span class="cursor"></span>hello')
    })

    it("truncates at the line width", function() {
        var buffer = Buffer('hello')
        var rendered = renderer.setLineWidth(4)(buffer)

        expect(rendered.html()).toEqual('<span class="cursor"></span>hell')
    })

    it("truncates multiple lines at the line width", function() {
        var buffer = Buffer('hello\ngoodbye')
        var rendered = renderer.setLineWidth(4)(buffer)
        var expected = '<span class="cursor"></span>hell\ngood'

        expect(rendered.html()).toEqual(expected)
    })

    it("truncates lines in the presence of html entities", function() {
        var buffer = Buffer('hi&bye')
        var rendered = renderer.setLineWidth(4)(buffer)
        var expected = '<span class="cursor"></span>hi&amp;b'

        expect(rendered.html()).toEqual(expected)
    })

    it("truncates lines in the presence of literal html tags", function() {
        var buffer = Buffer('<hello>')
        var rendered = renderer.setLineWidth(4)(buffer)
        var expected = '<span class="cursor"></span>&lt;hel'

        expect(rendered.html()).toEqual(expected)
    })

    it("truncates lines when the cursor is at the end", function() {
        var buffer = Buffer('hello')
          .moveRight()
          .moveRight()
          .moveRight()
        var rendered = renderer.setLineWidth(2)(buffer)

        expect(rendered.html()).toEqual('he');
    })

    it("renders the cursor at the end of a line", function() {
        var buffer = Buffer('ab')
          .moveRight()
          .moveRight()
        var rendered = renderer(buffer)

        expect(rendered.html()).toEqual('ab<span class="cursor"></span>');
    })

    it("renders the cursor at the right position", function() {
        var buffer = Buffer('hello\ngoodbye').moveRight()
        var rendered = renderer(buffer)
        var expected = 'h<span class="cursor"></span>ello\ngoodbye'

        expect(rendered.html()).toEqual(expected)
    })

    it("renders the cursor around selected text", function() {
        var buffer = Buffer('ham!')
            .selectRight()
            .selectRight()

        var rendered = renderer(buffer)
        var expected = '<span class="cursor">ha</span>m!'

        expect(rendered.html()).toEqual(expected)
    })

    it("renders selections spanning multiple lines", function() {
        var buffer = Buffer('a\nbc')
            .selectRight()
            .selectRight()
            .selectRight()

        var rendered = renderer(buffer)
        var expected = '<span class="cursor">a\nb</span>c'

        expect(rendered.html()).toEqual(expected)
    })

    it("html-escapes angle brackets and ampersands", function() {
        var buffer = Buffer('<script>h&cked')
        var rendered = renderer(buffer)
        var expected = '<span class="cursor"></span>&lt;script&gt;h&amp;cked'

        expect(rendered.html()).toEqual(expected)
    })

    it("html-escapes angle brackets and ampersands on lines not containing the cursor", function() {
        var buffer = Buffer('&\nb').moveRight().moveRight().moveRight()
        var rendered = renderer(buffer)
        var expected = '&amp;\nb<span class="cursor"></span>'

        expect(rendered.html()).toEqual(expected)
    })
})
