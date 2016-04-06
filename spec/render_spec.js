"use strict";

xdescribe("rendering", function() {
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

    it("truncates lines when the cursor is at the end", function() {
        var buffer = Buffer('hello')
          .moveRight()
          .moveRight()
          .moveRight()
        var rendered = renderer.setLineWidth(2)(buffer)

        expect(rendered.html()).toEqual('he');
    })

    it("renders the cursor at the right position", function() {
        var buffer = Buffer('hello\ngoodbye').moveRight()
        var rendered = renderer(buffer)
        var expected = 'h<span class="cursor"></span>ello\ngoodbye'

        expect(rendered.html()).toEqual(expected)
    })

    it("html-escapes angle brackets and ampersands", function() {
        var buffer = Buffer('<script>h&cked')
        var rendered = renderer(buffer)
        var expected = '<span class="cursor"></span>&lt;script&gt;h&amp;cked'

        expect(rendered.html()).toEqual(expected)
    })
})
