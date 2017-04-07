var count = 1;

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


function insertCommand(msg) {
    var obj = msg.obj;
    var cmd = "var x" + count + " = new " + msg.type + "(" +
            obj.x + "," + obj.y + "," + obj.width + "," + obj.height + ",'" +
            obj.fillColor + "'," + obj.lineWidth + ",'" + obj.lineColor
            + "');";
    window.term.exec(cmd, false);
    if (window.record === true)
        addCase(cmd);
    count++;
}

function initScenare() {
    window.scenare = new Array();
}

function addCase(cmd) {
    window.scenare.push(cmd);
    chrome.devtools.inspectedWindow.eval("console.log( " + cmd.toString() + ");");
}

function writeScenare() {
    function onInitFs(fs) {

        fs.root.getFile('log.txt', {create: true}, function (fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function (e) {
                    chrome.devtools.inspectedWindow.eval("console.log(Write completed);");
                };

                fileWriter.onerror = function (e) {
                    chrome.devtools.inspectedWindow.eval("console.log(Write failed: " + e.toString() + ");");
                };

                // Create a new Blob and write it to log.txt.
                var bb = new BlobBuilder();
                for (var i = 0; i < window.scenare.length; i++)
                    bb.append(window.scenare[i]);
                fileWriter.write(bb.getBlob('text/plain'));

            }, errorHandler);

        }, errorHandler);

    }
    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }
        ;
        chrome.devtools.inspectedWindow.eval("console.log(Error: " + msg + ");");
    }
    window.requestFileSystem(window.PERSISTENT, 20 * 1024 * 1024 /*20MB*/, onInitFs, errorHandler);
}

$(document).ready(function (event) {
    $("#start").click(function () {
        initScenare();
        window.record = true;
        chrome.devtools.inspectedWindow.eval("console.log(" + window.record.toString() + ");");
    });
    $("#stop").click(function () {
        writeScenare();
    });
});

