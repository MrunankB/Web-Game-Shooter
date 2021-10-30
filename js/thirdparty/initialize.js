Object.prototype.toType = function ()
{
    var funcNameRegex = /class (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};

Object.prototype.clone = function ()
{
    var that = this;
    var temp = new GameObject();//function temporary() { return that.apply(this, arguments); };
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

var engineInitialized = false;