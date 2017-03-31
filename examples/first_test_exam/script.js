var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

Point.prototype.getX = function () {
    return this.x;
};

Point.prototype.getY = function () {
    return this.y;
};

var Shape = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Point.call(this, x, y);
    this.point = new Point(x, y);
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
};

Shape.prototype = Object.create(Point.prototype);
Shape.prototype.constructor = Shape;
Shape.prototype.getWidth = function () {
    return this.width;
};

Shape.prototype.getHeight = function () {
    return this.height;
};

Shape.prototype.setColor = function (context) {
    context.fillStyle = this.fillColor;
};

Shape.prototype.setLine = function (context) {
    context.lineWidth = this.lineWidth;
};

Shape.prototype.setColorLine = function (context) {
    context.strokeStyle = this.lineColor;
};

Shape.prototype.clearShape = function (context) {
    context.clearRect(this.getX() - 5, this.getY() - 5, this.getWidth() + 10, this.getHeight() + 10);
};

var Rectangle = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.paint = function (context) {
    this.clearShape(context);
    context.beginPath();
    this.setColor(context);
    context.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    this.setLine(context);
    this.setColorLine(context);
    context.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    context.closePath();
};


var Ellipse = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.paint = function (context) {
    this.clearShape(context);
    this.setColor(context);
    context.beginPath();
    context.arc(this.getX() + this.getWidth() / 2, this.getY() + this.getWidth() / 2, this.getWidth() / 2, 0, 2 * Math.PI);
    context.fill();
    this.setLine(context);
    this.setColorLine(context);
    context.arc(this.getX() + this.getWidth() / 2, this.getY() + this.getWidth() / 2, this.getWidth() / 2, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
};

var Triangle = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Triangle;
Triangle.prototype.paint = function (context) {
    this.clearShape(context);
    this.setColor(context);
    context.beginPath();
    context.moveTo(this.getX() + this.getWidth() / 2, this.getY());
    context.lineTo(this.getX(), this.getY() + this.getHeight());
    context.lineTo(this.getX() + this.getWidth(), this.getY() + this.getHeight());
    context.lineTo(this.getX() + this.getWidth() / 2, this.getY());
    context.fill();
    context.closePath();
    context.beginPath();
    this.setLine(context);
    this.setColorLine(context);
    var rel;
    switch (this.lineWidth) {
        case 3:
            rel = 2;
            break;
        case 5:
            rel = 3;
            break;
        default :
            rel = 0;
            break;
    }
    context.moveTo(this.getX() + this.getWidth() / 2, this.getY());
    context.lineTo(this.getX(), this.getY() + this.getHeight());
    context.lineTo(this.getX() + this.getWidth(), this.getY() + this.getHeight());
    context.lineTo(this.getX() + this.getWidth() / 2, this.getY() - rel);
    context.stroke();
    context.closePath();
};


var Canvas = function (id) {
    this.objects = new Array();
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.width = parseInt(this.canvas.width);
    this.height = parseInt(this.canvas.height);
    this.fillColor = "red";
    this.lineWidth = 1;
    this.lineColor = "blue";
    this.controler;
    this.point;
};

Canvas.prototype.setPoint = function(){
    var AbsCoor = this.canvas.getBoundingClientRect();
    this.point = new Point(parseInt(AbsCoor.left), parseInt(AbsCoor.top));
};

Canvas.prototype.getWidth = function () {
    return this.width;
};

Canvas.prototype.getHeight = function () {
    return this.height;
};

Canvas.prototype.setColor = function (color) {
    this.fillColor = color;
};

Canvas.prototype.getColor = function () {
    return this.fillColor;
};

Canvas.prototype.setLineWidth = function (width) {
    this.lineWidth = width;
};

Canvas.prototype.getLineWidth = function () {
    return this.lineWidth;
};

Canvas.prototype.setLineColor = function (color) {
    this.lineColor = color;
};

Canvas.prototype.getLineColor = function () {
    return this.lineColor;
};

Canvas.prototype.add = function (object) {
    if (this.hasObject(object))
    {
        this.change(object);
    } else
    {
        this.objects.push(object);
    }
    this.controler.change(this.objects);
};

Canvas.prototype.hasObject = function (object) {
    for (i = 0; i < this.objects.length; i++) {
        if (
                (this.objects[i].getX() === object.getX())
                &&
                (this.objects[i].getY() === object.getY())
                )
            return true;
    }
    return false;
};

Canvas.prototype.change = function (object) {
    for (i = 0; i < this.objects.length; i++) {
        if (
                (this.objects[i].getX() === object.getX())
                &&
                (this.objects[i].getY() === object.getY())
                )
        {
            this.objects[i].fillColor = object.fillColor;
            this.objects[i].lineWidth = object.lineWidth;
            this.objects[i].lineColor = object.lineColor;
        }
    }
};


Canvas.prototype.repaint = function () {
    for (i = 0; i < this.objects.length; i++) {
        this.objects[i].paint(this.context);
    }
};

Canvas.prototype.getCoordinates = function (evt) {
    var coor = new Point(parseInt(evt.clientX ) - this.point.getX(),
            parseInt(evt.clientY ) - this.point.getY());
    return coor;
};

var MouseControler = function (canvas)
{
    this.paint = canvas;
};

MouseControler.prototype.monitor = function () {
    var paint = this.paint;
    var ref = this;
    paint.setPoint();
    window.addEventListener("init", function () {
        ref.listener(paint);
    });
};


MouseControler.prototype.listener = function (paint) {
    var ref = this;
    $(paint.canvas).mouseover(function () {
        $(this).mousemove(function (event) {
            for (var i = 0; i < paint.objects.length; i++) {
                ref.checkOnShape(paint.objects[i], event);
            }
        });
    });
    $(paint.canvas).mouseout(function () {
        $(this).unbind("mousemove");
    });
};

MouseControler.prototype.checkOnShape = function (object, event) {
    var ref = this;
    var coor = ref.paint.getCoordinates(event);
    if (
            (coor.getX() >= object.getX() && coor.getX() <= (object.getX() + object.getWidth()))
            &&
            (coor.getY() >= object.getY() && coor.getY() <= (object.getY() + object.getHeight()))
            ) {
        $("body").css("cursor", "pointer");
        ref.sendReference(object);
    } else {
        $("body").css("cursor", "crosshair");
    }
};

MouseControler.prototype.sendReference = function (object) {
    var event = new CustomEvent("ObjectReference", {detail: object});
    window.dispatchEvent(event);
};

MouseControler.prototype.change = function (objects) {
    this.paint.objects = objects;
};



$(document).ready(function (event) {
    var canvas = new Canvas("Canvas");
    canvas.controler = new MouseControler(canvas);
    canvas.controler.monitor();
    var panel = $(".panel .row .btn-group-sm");
    panel.eq(0).children("button").each(function (index) {
        $(this).click(function () {
            var object;
            switch (index) {
                case 0:
                    object = new Rectangle(100, 25, 160, 160, canvas.getColor(),
                            canvas.getLineWidth(), canvas.getLineColor());
                    break;
                case 1:
                    object = new Ellipse(500, 25, 160, 160, canvas.getColor(),
                            canvas.getLineWidth(), canvas.getLineColor());
                    break;
                case 2:
                    object = new Triangle(300, 225, 160, 160, canvas.getColor(),
                            canvas.getLineWidth(), canvas.getLineColor());
                    break;
            }
            canvas.add(object);
            canvas.repaint();
        });
    });

    panel.eq(1).children("button").each(function (index) {
        $(this).click(function () {
            switch (index) {
                case 0:
                    canvas.setColor("white");
                    break;
                case 1:
                    canvas.setLineWidth(0);
                    canvas.setLineColor("white");
                    break;
                case 2:
                    break;
            }
        });
    });
    panel.eq(2).children("button").each(function (index) {
        $(this).click(function () {
            switch (index) {
                case 0:
                    canvas.setColor("blue");
                    break;
                case 1:
                    canvas.setColor("red");
                    break;
                case 2:
                    canvas.setColor("green");
                    break;
            }
        });
    });
    panel.eq(3).children("button").each(function (index) {
        $(this).click(function () {
            switch (index) {
                case 0:
                    canvas.setLineColor("blue");
                    break;
                case 1:
                    canvas.setLineColor("red");
                    break;
                case 2:
                    canvas.setLineColor("green");
                    break;
            }
        });
    });
    panel.eq(4).children("button").each(function (index) {
        $(this).click(function () {
            switch (index) {
                case 0:
                    canvas.setLineWidth(5);
                    break;
                case 1:
                    canvas.setLineWidth(3);
                    break;
                case 2:
                    canvas.setLineWidth(1);
                    break;
            }
        });
    });

});









