/*=============================================
-----------------------------------
Copyright (c) 2016 Emmanuel Vaccaro
-----------------------------------
@file: renderer.js
@date: 26/09/2016
@author: Emmanuel Vaccaro
@brief: Component that renders sprites
===============================================*/

class Renderer extends Component {}

class SpriteRenderer extends Renderer
{
    constructor(file, depth)
    {
        /// <summary>Renders a Sprite for 2D graphics. NOTE: Sprites must be loaded before-hand (i.e, 'sprites[]')</summary>
        /// <param name="file" optional="true" type="GameObject">File name of sprite</param>
        super();
        this.enabled = true;
        this.color = 'blue';
        this.depth = depth ? depth : 0;
        this.sprite = new Sprite(file);
    }
    Start()
    {
        this.sprite.Start();
    }
    //spriteRenderer.type.push('SpriteRenderer');
    Update()
    {

    }
    Draw()
    {
        if (this.enabled)
        {
            // Use this function to draw elements
            context.save();
            context.translate(this.transform.position.x, this.transform.position.y);
            context.scale(this.transform.scale, this.transform.scale);

            //context.translate(this.position.x, this.position.y);
            context.rotate(this.transform.rotation);
            //context.translate(-this.position.x, -this.position.y);
            
            this.sprite.Draw();
            
            context.restore();
        }
    }
    OnCollisionEnter(collidedObject)
    {
        // Use this function to handle collision response
    }
    OnCollisionStay(collidedObject)
    {
        // Use this function to handle collision response
    }
    OnCollisionExit(collidedObject)
    {
        // Use this function to handle collision response
    }
}

var loadedImages = [];

class Sprite
{
    constructor(file)
    {
        /// <summary>Represents a Sprite object for use in 2D gameplay.</summary>
        /// <param name="file" optional="true" type="GameObject">File name of sprite</param>
        this.file = file;
        var loadedImage = loadedImages[this.file];
        if (loadedImage == null) {
            loadedImage = loadedImages['default.png'];
        }
        this.width = loadedImage ? loadedImage.width :  10;
        this.height = loadedImage ? loadedImage.height : 10;
        this.src = spriteFolderPath + file;
        this.color = 'blue';
        this.isLoaded = false;
    }
     
    Start()
    {
        if (this.file == null) { this.file = 'default.png'; }
        var loadedImage = loadedImages[this.file];
        if (loadedImage == null) {
            loadedImage = loadedImages['default.png'];
        }
        this.image = loadedImage;
        this.width = loadedImage.width;
        this.height = loadedImage.height;
    }

    Draw()
    {
        if (this.image != null) {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
    }
}
