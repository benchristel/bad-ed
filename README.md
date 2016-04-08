# Bad Ed

Bad Ed is a text editor that runs in Chrome. It might someday metamorphose into a beautiful operating system! We'll see.

This isn't as crazy as it sounds at first. A text editor that runs in a browser is not that far from being an OS already. It satisfies the first of 2 major requirements for OS-hood:

An operating system...

- ...Lets the user perform CRUD operations on files
- ...Lets the user run executable files

Other responsibilities often ascribed to OSes (like interfacing with hardware and networks) are really implementation details of the above requirements.

If we slap a javascript runtime on top of our text editor, we have an OS. Oh wait, the browser already has one of those. We're done!

## Philosophy

Bad Ed is supposed to be an Nth-order text editor. (It's not, yet.)

`cat` is a first-order text editor. You type some characters, and those are the characters that appear in your file.

`vi` is a second-order editor. You type commands, which sometimes insert literal characters into your file but also perform higher-level operations, like searching, replacing, and operating on multiple lines.

In theory, higher orders are possible, and even desirable: sometimes you want to edit your _command history_ rather than editing the file directly. A very simple example is `undo`: if you can change the command history, it's easy to revert goofs. However, editing history is much more powerful than the `undo` feature in most editors. I sometimes want to revert the _second-to-last_ change I made, and the most expedient way to do this is usually to just copy the text I want to save, undo twice, and paste my most recent change back in. That's pretty gross.

`vi` provides limited higher-order functionality by being scriptable, allowing the user to define their own commands. Often, though, immediate, incremental feedback is extremely valuable. It's hard to understate the value of the "multiple cursor" functionality provided by modern editors, even though a regex find-replace solves the same problems. The "multiple cursor" solution gives incremental feedback; find-replace usually doesn't.


