"use strict";

const ESCAPE = 27;
const BACKSPACE = 8;
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SHIFT = 16;

const keymap = {
  13:  '\n',
  32:  ' ',
  48:  '0',
  49:  '1',
  50:  '2',
  51:  '3',
  52:  '4',
  53:  '5',
  54:  '6',
  55:  '7',
  56:  '8',
  57:  '9',
  65:  'a',
  66:  'b',
  67:  'c',
  68:  'd',
  69:  'e',
  70:  'f',
  71:  'g',
  72:  'h',
  73:  'i',
  74:  'j',
  75:  'k',
  76:  'l',
  77:  'm',
  78:  'n',
  79:  'o',
  80:  'p',
  81:  'q',
  82:  'r',
  83:  's',
  84:  't',
  85:  'u',
  86:  'v',
  87:  'w',
  88:  'x',
  89:  'y',
  90:  'z',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'"
};

const shiftKeymap = {
  13:  '\n',
  32:  '_',
  48:  ')',
  49:  '!',
  50:  '@',
  51:  '#',
  52:  '$',
  53:  '%',
  54:  '^',
  55:  '&',
  56:  '*',
  57:  '(',
  65:  'A',
  66:  'B',
  67:  'C',
  68:  'D',
  69:  'E',
  70:  'F',
  71:  'G',
  72:  'H',
  73:  'I',
  74:  'J',
  75:  'K',
  76:  'L',
  77:  'M',
  78:  'N',
  79:  'O',
  80:  'P',
  81:  'Q',
  82:  'R',
  83:  'S',
  84:  'T',
  85:  'U',
  86:  'V',
  87:  'W',
  88:  'X',
  89:  'Y',
  90:  'Z',
  186: ':',
  187: '+',
  188: '<',
  189: '_',
  190: '>',
  191: '?',
  192: '~',
  219: '{',
  220: '|',
  221: '}',
  222: '"'
};

const keyboardController = {
    handleKeyDown: function(event, buffer) {
        console.log(event)

        if (event.keyCode === BACKSPACE) {
            return buffer.backspace()
        }

        if (event.keyCode === LEFT) {
            if (event.shiftKey) {
                return buffer.selectLeft();
            } else {
                return buffer.moveLeft()
            }
        }

        if (event.keyCode === RIGHT) {
            if (event.shiftKey) {
                return buffer.selectRight();
            } else {
                return buffer.moveRight();
            }
        }

        if (event.keyCode === UP) {
            return buffer.moveUp();
        }

        if (event.shiftKey) {
            return buffer.insert(shiftKeymap[event.keyCode])
        } else {
            return buffer.insert(keymap[event.keyCode])
        }
    }
}
