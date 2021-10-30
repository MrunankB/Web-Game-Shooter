/*=============================================
-----------------------------------
Copyright (c) 2016 Emmanuel Vaccaro
-----------------------------------
@file: gameobject.js
@date: 25/09/2016
@author: Emmanuel Vaccaro
@brief: Class object that defines a GameObject 
entity
===============================================*/

// List of gameobjects in the scene
var gameObjects = [];

/*
 * GameObject class 
 */

function merge(target)
{
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source)
    {
        Object.getOwnPropertyNames(source).forEach(function (propName)
        {
            Object.defineProperty(target, propName,
                Object.getOwnPropertyDescriptor(source, propName));
        });
    });
    return target;
};

function cloneObject(obj)
{
    var copy = Object.create(Object.getPrototypeOf(obj));
    merge(copy, obj);
    return copy;
}

class GameObject extends BaseObject
{
    constructor(other) 
    {
        /// <summary>Base class for all entities in Unity scenes.</summary>
        /// <param name="other" type="GameObject">Other GameObject to copy.</param>
        super(other);
        this.name = other ? (engineInitialized ? "(Clone) " + other.name : other.name) : 'GameObject ' + this.instanceId; // to distinguish between gameobjects
        this.velocity = other ? other.velocity : new Vector();
        this.isActive = other ? other.isActive : true;
        this.tag = other ? other.tag : 'untagged';
        this.layer = other ? other.layer : 'none';
        this.transform = new Transform();
        this.gameObject = this;

        this.components = [];
        if (other && other.components)
        {
            for (var i = 0; i < other.components.length; i++)
            {
                var component = other.components[i];
                var clone = cloneObject(component);
                this.AddComponent(clone);
            }
        }
    }
       
    Start()
    {
        this.transform.gameObject = this;
        this.transform.transform = this.transform;
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].Start();
        }
    }
    Update()
    {
        this.transform.Update();
        //console.log("You must override the 'update' function for " + this.name);
        for (var i = 0; i < this.components.length; i++)
        {
            this.components[i].Update();
        }
    }
    Draw()
    {
        if (this.isActive)
        {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].Draw();
            }
        }
    }
    OnCollisionEnter(col) {
        // Use this function to handle collision response
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].OnCollisionEnter(col);
        }
    }
    OnCollisionStay(col)
    {
        // Use this function to handle collision response
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].OnCollisionStay(col);
        }
    }
    OnCollisionExit(col)
    {
        // Use this function to handle collision response
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].OnCollisionExit(col);
        }
    }

    AddComponent(componentType)
    {
        /// <summary>Adds a component class to the game object.</summary>
        /// <param name="Component" type="T">Component to be added to GameObject.</param>
        var newComponent = null;
        if (componentType.isFunction()) {
            newComponent = new componentType();
        } else {
            newComponent = componentType;
        }
        newComponent.gameObject = this;
        newComponent.transform = this.transform;

        if (engineInitialized)
        {
            newComponent.Start();
        }

        this.components.push(newComponent);
        return newComponent;
    }
    GetComponent(componentType)
    {
        /// <summary>Returns the component of Type type if the game object has one attached, null if it doesn't.</summary>
        /// <param name="Component" type="T">Component to be obtained.</param>

        for (var i = 0; i < this.components.length; i++)
        {
            var component = this.components[i];
            if (component instanceof componentType)
            {
                return this.components[i];
            }
        }
        return null;
    }
    GetComponents(componentType)
    {
        /// <summary>Returns all components of Type type in the GameObject.</summary>
        /// <param name="Component" type="T">Component to be obtained.</param>

        var components = [];
        var isFound = false;
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof componentType) {
                components.push(this.components[i]);
                isFound = true;
            }
        }
        if (isFound) {
            return components;
        }
        return null;
    }
}

Object.prototype.isFunction = function() {
    var getType = {};
    return this && getType.toString.call(this) === '[object Function]';
}