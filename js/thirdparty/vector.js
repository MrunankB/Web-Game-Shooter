class Vector
{
    constructor(x, y, z)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    negative()
    {
        return new Vector(-this.x, -this.y, -this.z);
    }
    add(v)
    {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }
    subtract(v)
    {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }
    multiply(v)
    {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }
    divide(v)
    {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }
    normalized()
    {
        var length = this.length();
        if (length > 0) {
            return new Vector(this.x / length, this.y / length, this.z / length);
        }
        return new Vector(0, 0, 0);
    }
    equals(v)
    {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    dot(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v)
    {
        return new Vector(
          this.y * v.z - this.z * v.y,
          this.z * v.x - this.x * v.z,
          this.x * v.y - this.y * v.x
        );
    }
    length()
    {
        return Math.sqrt(this.dot(this));
    }
    unit()
    {
        return this.divide(this.length());
    }
    min()
    {
        return Math.min(Math.min(this.x, this.y), this.z);
    }
    max()
    {
        return Math.max(Math.max(this.x, this.y), this.z);
    }
    toAngles()
    {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
            pi: Math.atan2(this.y, this.x)
        };
    }
    angleTo(a)
    {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    toArray(n)
    {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }
    clone()
    {
        return new Vector(this.x, this.y, this.z);
    }
    init(x, y, z) {
        this.x = x; this.y = y; this.z = z;
        return this;
    }
}


Vector.negative = function (a, b)
{
    b.x = -a.x; b.y = -a.y; b.z = -a.z;
    return b;
};
Vector.add = function (a, b, c)
{
    if (b instanceof Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; }
    else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
    return c;
};
Vector.subtract = function (a, b, c)
{
    if (b instanceof Vector) { c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z; }
    else { c.x = a.x - b; c.y = a.y - b; c.z = a.z - b; }
    return c;
};
Vector.multiply = function (a, b, c)
{
    if (b instanceof Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; }
    else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
    return c;
};
Vector.divide = function (a, b, c)
{
    if (b instanceof Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; }
    else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
    return c;
};
Vector.cross = function (a, b, c)
{
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
};
Vector.unit = function (a, b)
{
    var length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
};
Vector.fromAngles = function (theta, phi)
{
    return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.randomDirection = function ()
{
    return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function (a, b)
{
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function (a, b)
{
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function (a, b, fraction)
{
    return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function (a)
{
    return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function (a, b)
{
    return a.angleTo(b);
};

