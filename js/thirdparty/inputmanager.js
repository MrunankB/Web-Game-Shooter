/*=============================================
-----------------------------------
Copyright (c) 2016 Emmanuel Vaccaro
-----------------------------------
@file: inputmanager.js
@date: 24/03/2016
@author: Emmanuel Vaccaro
@brief: Manages Keyboard & Mouse input
===============================================*/

// Dictionary of keycodes
var keys = {};
keys['escape'] = 27;
keys['f1'] = 112;
keys['f2'] = 113;
keys['f3'] = 114;
keys['f4'] = 115;
keys['f5'] = 116;
keys['f6'] = 117;
keys['f7'] = 118;
keys['f8'] = 119;
keys['f9'] = 120;
keys['f10'] = 121;
keys['f11'] = 122;
keys['f12'] = 123;
keys['altGr'] = 192;
keys['1'] = 49;
keys['2'] = 50;
keys['3'] = 51;
keys['4'] = 52;
keys['5'] = 53;
keys['6'] = 54;
keys['7'] = 55;
keys['8'] = 56;
keys['9'] = 57;
keys['0'] = 48;
keys['-'] = 189;
keys['='] = 187;
keys['backspace'] = 8;
keys['tab'] = 9;
keys['q'] = 81;
keys['w'] = 87;
keys['e'] = 69;
keys['r'] = 82;
keys['t'] = 84;
keys['y'] = 89;
keys['u'] = 85;
keys['i'] = 73;
keys['o'] = 79;
keys['p'] = 80;
keys['['] = 219;
keys[']'] = 221;
keys['backslash'] = 220;
keys['\\'] = 220;
keys['capslock'] = 20;
keys['a'] = 65;
keys['s'] = 83;
keys['d'] = 68;
keys['f'] = 70;
keys['g'] = 71;
keys['h'] = 72;
keys['j'] = 74;
keys['k'] = 75;
keys['l'] = 76;
keys[';'] = 186;
keys["'"] = 222;
keys["enter"] = 13;
keys["leftshift"] = 16;
keys["z"] = 90;
keys["x"] = 88;
keys["c"] = 67;
keys["v"] = 86;
keys["b"] = 66;
keys["n"] = 78;
keys["m"] = 77;
keys[","] = 188;
keys["."] = 190;
keys["/"] = 191;
keys["rightshift"] = 16;
keys["leftctrl"] = 17;
keys["leftalt"] = 18;
keys["space"] = 32;
keys["rightalt"] = 18;
keys["rightctrl"] = 17;
keys["up"] = 38;
keys["down"] = 40;
keys["left"] = 37;
keys["right"] = 39;

// >> Add more KeyCodes here <<

// Dictionary of mouse button codes
var mouseButtons = {};
mouseButtons['left'] = 1;
mouseButtons['middle'] = 2;
mouseButtons['right'] = 3;

// >> Add more MouseButtons here <<

// Input object that handles input throughout the project
var Input =
{
    _keysUp: [],
    _keysPressed: [],
    _keysDown: [],
    _mousePosition: new Vector(),
    _mouseButtonsDown: [],

    // Returns the mouse position variable
    GetMousePosition: function ()
    {
        return this._mousePosition;
    },

    // Function that checks if a mouse button is down and returns true/false
    GetMouseButtonDown: function (buttonName)
    {
        // Try and obtain the button code from the list of mouse buttons defined
        var findButtonCode = mouseButtons[buttonName];
        // Check if the button code exists in the list
        if (findButtonCode != undefined) {
            // Check if the button is in the list of mouse buttons down
            if (this._mouseButtonsDown.includes(findButtonCode)) {
                // The button is down!
                return true;
            }
        }
        // The button is NOT down!
        return false;
    },

    GetKey: function (keyName)
    {
        // Try and obtain the keycode from the list of keys defined
        var findKeyCode = keys[keyName];
        // Check if the keycode exists in the list
        if (findKeyCode != undefined) {
            // Check if the key is in the list of keys down
            if (this._keysPressed.includes(findKeyCode)) {
                // The key is down!
                return true;
            }
        } else {
            // Print error message otherwise
            console.error("The key name '" + keyName + "' is not defined inside of 'keys'");
        }
        // The key is NOT down
        return false;
    },

    // Function that checks if a key is down and returns true/false
    GetKeyDown: function (keyName)
    {
        // Try and obtain the keycode from the list of keys defined
        var findKeyCode = keys[keyName];
        // Check if the keycode exists in the list
        if (findKeyCode != undefined) {
            // Check if the key is in the list of keys down
            if (this._keysDown.includes(findKeyCode)) {
                // The key is down!
                return true;
            }
        } else {
            // Print error message otherwise
            console.error("The key name '" + keyName + "' is not defined inside of 'keys'");
        }
        // The key is NOT down
        return false;
    },

    Update: function ()
    {
        this._keysDown = [];
    }
}

/*
 * Document events
 */

// Add an event to the document that gets the mouse position
$(document).mousemove(function (event)
{
    // Set the mouse positions
    Input._mousePosition.x = event.pageX;
    Input._mousePosition.y = event.pageY;
});

// Add a mousedown event to test for which buttons are down
$(document).mousedown(function (event)
{
    // Push the button that is down onto list
    Input._mouseButtonsDown.push(event.which);
});

// Add a mouseup event to test for mouse buttons which are up
$(document).mouseup(function (event)
{
    // Remove the key that is up from the keysDown list
    Input._mouseButtonsDown = Input._mouseButtonsDown.filter(function (buttonCode)
    {
        return buttonCode != event.which;
    });
})

// Add a keydown event to test for keys that are down
$(document).keydown(function (event)
{
    // Push the key that is down onto list
    Input._keysDown.push(event.keyCode);
    Input._keysPressed.push(event.keyCode);
});

// Add a keyup event to test for keys that are up
$(document).keyup(function (event)
{
    Input._keysDown = Input._keysDown.filter(function (keyCode)
    {
        return keyCode != event.keyCode;
    });
    // Remove the key that is up from the keysDown list
    Input._keysPressed = Input._keysPressed.filter(function (keyCode)
    {
        return keyCode != event.keyCode;
    });
});