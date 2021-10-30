/*=============================================
-----------------------------------
Copyright (c) 2016 Emmanuel Vaccaro
-----------------------------------
@file: physics.js
@date: 25/03/2016
@author: Emmanuel Vaccaro
@brief: Simulates physics
===============================================*/
class Bounds
{
    constructor(width, height)
    {
        this.width = width || 10;
        this.height = height || 10;
        this.size = { width: width, height: height };
        this.extents = new Vector();
        this.center = new Vector();
        this.max = new Vector();
        this.min = new Vector();

        this.extents = new Vector(this.size.width / 2, this.size.height / 2);
    }
}

class Collider extends Component
{
    constructor() 
    {
        super();
        this.bounds = new Bounds();
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

class BoxCollider extends Collider
{
    constructor() 
    {
        /// <summary>Collider for 2D physics representing an axis-aligned rectangle.</summary>
        super();
        this.size = new Vector(10, 10);
        this.center = new Vector();
    }
    Start()
    {
        var renderer = this.gameObject.GetComponent(Renderer);
        if (renderer != null) {
            var spriteRenderer = this.gameObject.GetComponent(SpriteRenderer);
            if (spriteRenderer != null) {
                var width = spriteRenderer.sprite.width;
                var height = spriteRenderer.sprite.height;
                this.size = new Vector(width, height);
            }
        }
    }
    Update()
    {
        Gizmos.AddBox(this.transform.position, this.size.multiply(this.transform.scale), 0, "green", false);
    }
}

class CircleCollider extends Collider
{
    constructor() 
    {
        /// <summary>The Circle Collider class is a collider for use with 2D physics.</summary>
        super();
        this.radius = 10.0;
        this.center = new Vector();
    }
    Start()
    {
        var renderer = this.gameObject.GetComponent(Renderer);
        if (renderer != null) {
            var spriteRenderer = this.gameObject.GetComponent(SpriteRenderer);
            if (spriteRenderer != null) {
                var width = spriteRenderer.sprite.width;
                var height = spriteRenderer.sprite.height;
                this.radius = Math.max(width, height) / 2;
            }
        }
    }
    Update()
    {
        Gizmos.AddCircle(this.transform.position, this.radius * this.transform.scale, "green", false);
    }
}

var collisions = {};

function HandleCollisions()
{
    for (var x = 0; x < gameObjects.length; x++) {
        for (var y = 0; y < gameObjects.length; y++) {
            var gameObjectA = gameObjects[x];
            var gameObjectB = gameObjects[y];
            
            // Check if both gameObjects exist
            if (gameObjectA != null && gameObjectB != null &&
                !Object.is(gameObjectA, gameObjectB)) // AND they are not the same
            {
                var colA = gameObjectA.GetComponent(Collider);
                var colB = gameObjectB.GetComponent(Collider);
                // Check if both colliders exist
                if (colA != null && colB != null &&
                    colA.instanceId != colB.instanceId &&
                    colA.enabled && colB.enabled) // AND they're both enabled
                {
                    // Determine if those objects collide with each other
                    if (Collides(colA, colB))
                    {
                        if (collisions[colA.instanceId] == undefined &&
                            collisions[colB.instanceId] == undefined)
                        {
                            gameObjectA.OnCollisionEnter(colB);
                            gameObjectB.OnCollisionEnter(colA);
                            collisions[colA.instanceId] = colA.instanceId;
                            collisions[colB.instanceId] = colB.instanceId;
                        }
                        
                        // Collision is touching
                        gameObjectA.OnCollisionStay(colB);
                        gameObjectB.OnCollisionStay(colA);
                    } else {
                        if (collisions[colA.instanceId] != undefined &&
                            collisions[colB.instanceId] != undefined)
                        {
                            gameObjectA.OnCollisionExit(colB);
                            gameObjectB.OnCollisionExit(colA);
                            collisions[colA.instanceId] = undefined;
                            collisions[colB.instanceId] = undefined;
                        }
                    }
                }
            }
        }
    }
}

function Collides(colA, colB)
{
    // Box to Box
    if(colA instanceof BoxCollider && colB instanceof BoxCollider) 
    {
        return BoxToBox(colA, colB);
    }

    // Box to Circle || Circle to Box
    if(colA instanceof BoxCollider && colB instanceof CircleCollider || 
       colB instanceof BoxCollider && colA instanceof CircleCollider) 
    {
        return BoxToCircle(colA, colB);
    }

    // Circle to Circle
    if(colA instanceof CircleCollider && colB instanceof CircleCollider) 
    {
        return CircleToCircle(colA, colB);
    }

    console.log("Error: Cannot detect colliders");
    return false;
}

function BoxToBox(boxA, boxB) 
{
    /// <summary>Determines if two boxes have collided with each other</summary>
    /// <returns value='1'/>
    /// <param name="boxA" type="Collider">The first box collider.</param>
    /// <param name="boxB" type="Collider">The second box collider.</param>
    var boxASize = new Vector(boxA.size.x * boxA.transform.scale, boxA.size.y * boxA.transform.scale);
    var boxBSize = new Vector(boxB.size.x * boxB.transform.scale, boxB.size.y * boxB.transform.scale);
    
    if (Math.abs(boxA.transform.position.x - boxB.transform.position.x) < boxASize.x / 2 + boxBSize.x / 2) {
        if (Math.abs(boxA.transform.position.y - boxB.transform.position.y) < boxASize.y / 2 + boxBSize.y / 2) {
            return true;
        }
    }
    return false;
}

function CircleToCircle(circleA, circleB) 
{
    var a = circleA.transform.position.x - circleB.transform.position.x;
    var b = circleA.transform.position.y - circleB.transform.position.y;
    var distance = Math.sqrt(a * a + b * b);
    if (distance < circleA.radius * circleA.transform.scale + circleB.radius * circleB.transform.scale) {
        return true;
    }
    return false;
}

function BoxToCircle(box, circle) 
{
    //var deltaX = circle.transform.position.x - Math.max(box.transform.position.x, )
    // NEEDS IMPLEMENTATION
    return false;
}