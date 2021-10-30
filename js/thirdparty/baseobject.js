function Clone() { }
function clone(obj)
{
    Clone.prototype = obj;
    return new Clone();
}

function FunctionName(fun)
{
    var ret = fun.toString();
    ret = ret.substr('class '.length);
    ret = ret.substr(0, ret.indexOf(' '));
    return ret;
}

class BaseObject
{ 
    constructor()
    {
        this.transform = null;
        this.gameObject = null;
        this.instanceId = BaseObject.instanceId++;
        this.name = 'BaseObject ' + this.instanceId;
    }

    Start() {}
    Update() {}
    Draw() {}

    OnCollisionStay(col) {}

    Instantiate(gameObject)
    {
        /// <summary>Makes a new copy of a GameObject</summary>
        /// <param name="gameObject" type="GameObject">GameObject to be cloned.</param>
        var clone = new GameObject(gameObject);
        gameObjects.push(clone);
        return clone;
    }

    Destroy(gameObject)
    {
        // If a game object is no longer active, remove it from the list
        gameObjects = gameObjects.filter(function (object)
        {
            return !Object.is(gameObject, object);
        });
    }
}

BaseObject.instanceId = 0;
BaseObject.Instantiate = function(gameObject)  
{
    /// <summary>Makes a new copy of a GameObject</summary>
    /// <param name="gameObject" type="GameObject">GameObject to be cloned.</param>
    var clone = new GameObject(gameObject);
    gameObjects.push(clone);
    return clone;
}

BaseObject.Destroy = function(gameObject)
{
    // If a game object is no longer active, remove it from the list
    gameObjects = gameObjects.filter(function (object)
    {
        return !Object.is(gameObject, object);
    });
}
