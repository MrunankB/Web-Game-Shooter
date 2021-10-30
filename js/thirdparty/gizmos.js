function BaseShape()
{
    var baseShape =
    {
        position: new Vector(),
        color: "black",
        isFilled: false,
        lineWidth: 1
    }
    return baseShape;
}

function Circle()
{
    var circle = new BaseShape();
    circle.radius = 1;
    return circle;
}

function Box()
{
    var box = new BaseShape();
    box.size = new Vector();
    return box;
}

function Gizmos() { }

Gizmos.boxes = [];
Gizmos.circles = [];

Gizmos.Draw = function ()
{
    if (debugging) {
        this.DrawBoxes();
        this.DrawCircles();
    }
}

Gizmos.DrawBoxes = function ()
{
    for (var i = 0; i < this.boxes.length; i++) {
        var box = this.boxes[i];
        // Use this function to draw elements
        context.save();
        context.translate(box.position.x, box.position.y);

        context.rotate(box.rotation);

        context.lineWidth = box.lineWidth;
        context.fillStyle = box.color;
        context.strokeStyle = box.color;

        context.beginPath();
        context.rect(-box.size.x / 2, -box.size.x / 2, box.size.x, box.size.y);
        context.closePath();

        if (box.isFilled) {
            context.fill();
        } else {
            context.stroke();
        }

        context.restore();
    }
    this.boxes = [];
}

Gizmos.DrawCircles = function ()
{
    for (var i = 0; i < this.circles.length; i++) {

        var circle = this.circles[i];
        if (circle.radius > 0) {

            // Use this function to draw elements
            context.save();
            context.translate(circle.position.x, circle.position.y);

            context.scale(1, 1);

            context.lineWidth = circle.lineWidth;
            context.fillStyle = circle.color;
            context.strokeStyle = circle.color;

            context.beginPath();
            context.arc(0, 0, circle.radius, 0, 2 * Math.PI);
            context.closePath();


            if (circle.isFilled) {
                context.fill();
            } else {
                context.stroke();
            }

            context.restore();
        }
    }
    this.circles = [];
}

Gizmos.AddCircle = function (position, radius, color, isFilled, lineWidth)
{
    if (debugging) {
        if (context == null) { console.log("You can only call the 'Gizmos.AddCircle' function within Update"); }

        if (position == null) { position = new Vector(); }
        if (radius == null) { radius = 5; }
        if (color == null) { color = "black"; }
        if (isFilled == null) { isFilled = true; }
        if (lineWidth == null) { lineWidth = 1; }

        var newCircle = new Circle();
        newCircle.position = position;
        newCircle.radius = radius;
        newCircle.color = color;
        newCircle.isFilled = isFilled;
        newCircle.lineWidth = lineWidth;
        this.circles.push(newCircle);
    }
}
Gizmos.AddBox = function (position, size, rotation, color, isFilled, lineWidth)
{
    if (debugging) {
        if (context == null) { console.log("You can only call the 'Gizmos.AddCircle' function within Update"); }

        if (position == null) { position = new Vector(); }
        if (size == null) { size = new Vector(10, 10); }
        if (rotation == null) { rotation = 0; }
        if (color == null) { color = "black"; }
        if (isFilled == null) { isFilled = true; }
        if (lineWidth == null) { lineWidth = 1; }

        var newBox = new Box();
        newBox.position = position;
        newBox.size = size;
        newBox.rotation = rotation;
        newBox.color = color;
        newBox.isFilled = isFilled;
        newBox.lineWidth = lineWidth;
        this.boxes.push(newBox);
    }
}