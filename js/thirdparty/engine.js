/*=============================================
-----------------------------------
Copyright (c) 2016 Emmanuel Vaccaro
-----------------------------------
@file: engine.js
@date: 24/03/2016
@author: Emmanuel Vaccaro
@brief: Updates the game, physics & time
===============================================*/

// Setup frames per second (cap)
var FPS = 60;
var debugging = true;

// Obtain the GameCanvas from the document
var canvas = document.getElementById('GameCanvas');
// Get the '2d' context from the canvas for drawing
var context = canvas.getContext('2d');

// Define the clear color
var CLEAR_COLOR = "white";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasCenter = new Vector(canvas.width / 2, canvas.height / 2);

var Time = {
    deltaTime: 0.033,
    currTime: 0,
    prevTime: Date.now(),
    Update: function ()
    {
        // Calculate deltaTime
        this.currTime = Date.now();
        this.deltaTime = (this.currTime - this.prevTime) / 1000;
        this.prevTime = this.currTime;
    }
}

// Updates all elements in the game
function UpdateEngine()
{
    Time.Update();

    // Automatically scale the canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCenter = new Vector(canvas.width / 2, canvas.height / 2);

    HandleCollisions();

    // Loop through all game objects and call update on each
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Update();
    }
}

/* Debugging */
$('#content').append("<ul id='debugger'></ul>");
var Debug = {
    log: function (text)
    {
        if (debugging) {
            $('#debugger').append("<li>" + text + "</li>");
        }
    },
    clear: function (text)
    {
        $('#debugger').empty();
    }
}

function SortGameObjects()
{
    gameObjects = gameObjects.sort(function (goA, goB)
    {
        var rendererA = goA.GetComponent(SpriteRenderer);
        var rendererB = goB.GetComponent(SpriteRenderer);
        if (rendererA != undefined && rendererA != null &&
           rendererB != undefined && rendererB != null) {
            return rendererB.depth - rendererA.depth;
        }
        return -1;
    });
}

// Draws all elements to the screen
function DrawEngine()
{
    SortGameObjects();
    // Loop through all game objects and draw each element
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Draw();
        Debug.log(gameObjects[i].name);
    }
}

// Helper methods
function random(min, max)
{
    // Randomizes between min and max values
    return min + Math.random() * (max - min);
}

/*
 * Load all sprites
 */
var loadedSpriteNum = 0;
var spriteFolderPath = "resources/sprites/";
$(window).ready(function(){
    for (var i = 0; i < sprites.length; i++) {
        var fileName = sprites[i];
        var image = new Image();
        image.src = spriteFolderPath + fileName;
        loadedImages[fileName] = image;
        image.onload = function() {
            loadedSpriteNum++;
            if (loadedSpriteNum >= sprites.length) {
                RunEngine();
            }
        }
    }
});

function RunEngine()
{
    // Loop through all game objects and call update on each
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Start();
    }

    engineInitialized = true;

    // Set interval will call the functions at a... set interval (in milliseconds)
    setInterval(function ()
    {
        Debug.clear();

        // Clear the screen before the frame commenses
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set a clear color and create our back buffer
        context.fillStyle = CLEAR_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);

        UpdateEngine();
        DrawEngine();
        Gizmos.Draw();
        Input.Update();
    }, 1000 / FPS);
}