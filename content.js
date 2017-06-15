var id = "[CONTENT SCRIPT] ";

var Point = function (x, y) {
    this.x = x;
    this.y = y;
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

Shape.prototype.equal = function(object){
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length ; i++)
    {
        if(object[keys[i]] instanceof Object){
            if(!this.equal(object[keys[i]])){           
                return false;
            }
        }
        else{
        if(object[keys[i]] !== this[keys[i]])
                return false;
        }
    }
    return true;
};


var Rectangle = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;


var Ellipse = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;


var Triangle = function (x, y, width, height, fillColor, lineWidth, lineColor) {
    Shape.call(this, x, y, width, height, fillColor, lineWidth, lineColor);
};

Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Triangle;


var ContentController = function () {
    this.title;
    this.pagetTitle;
    this.port;
    this.pageObjects = new Array();
    this.setListener();
};


ContentController.prototype.getPageBasic = function () {
    var dom = $(":root");
    this.title = $(dom).find("title").text();
    this.pageTitle = $(dom).find("h1").first().text();
    console.log(id + "Vítejte GUI Tester");
    console.log(id + "Stránka s titulkem " + this.title);
    console.log(id + "Stránka s nadpisem " + this.pageTitle);
};

ContentController.prototype.showDevtools = function(){
    var event = new KeyboardEvent("keydown");
    event.ctrlKey = true;
    event.shiftKey = true;
    event.keyCode = 105;
    event.which = 105;
    window.dispatchEvent(event);
    console.log(event);
};

ContentController.prototype.setMonitor = function () {
    var event = new CustomEvent("init", {});
    window.dispatchEvent(event);
};

ContentController.prototype.setListener = function () {
    window.addEventListener("ObjectReference", function (event) {
            var shape;
            var EvtShape = event.detail.obj; 
            shape = eval("new "  + event.detail.type  + "(" + 
                    EvtShape.x + "," + 
                    EvtShape.y + "," + 
                    EvtShape.width + "," + 
                    EvtShape.height + ",'" +
                    EvtShape.fillColor + "'," +
                    EvtShape.lineWidth + ",'" +
                    EvtShape.lineColor + "');");
            
            if(!this.hasDetail(shape))
            {
                console.log(id + JSON.stringify(shape));
                this.notifyBackPage(event.detail);
                this.pageObjects.push(shape);
            }
    }.bind(this));
    window.addEventListener("CanvasReference", function listener(event) {
        console.log(id + "canvas sended");
        chrome.runtime.sendMessage({detail: event.detail});
        window.removeEventListener("CanvasReference", listener);
    });
    this.setMonitor();  
};


ContentController.prototype.notifyBackPage = function (msg) {
    chrome.runtime.sendMessage({detail: msg});
};

ContentController.prototype.hasDetail = function(object){
    for(var i=0; i < this.pageObjects.length;i++){
        if (this.pageObjects[i].equal(object) && object instanceof this.pageObjects[i].constructor)   
        {
            return true;
        }
        else{         
        }
    }
    return false;
};


$(document).ready(function (event) {
    var conController = new ContentController();
        conController.getPageBasic();
        $("body").css("cursor", "crosshair");
        conController.showDevtools();
});


















