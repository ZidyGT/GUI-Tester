/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectOfCanvas;
var MainCanvas = window.getMainCanvasObject();
var event = new CustomEvent("Interaction", {detail: "canvas"});
window.dispatchEvent(event);

var GuiTester = function () {
    this.MainCanvasID = window.getMainCanvasObjectID();
    this.MouseOffset;
    this.Event;
    this.Element;
    var clientRect = document.getElementById(this.MainCanvasID).getBoundingClientRect();
    this.bounding = {x:clientRect.left, y:clientRect.top};

    this.mouseListenerObject = function (click) {
        var x = click.clientX;
        var y = click.clientY;
        ObjectOfCanvas = MainCanvas.getObjectAtOffset(x - this.bounding.x, y - this.bounding.y);
        var event = new CustomEvent("Interaction", {detail: "object"});
        window.dispatchEvent(event);
    }.bind(this);

    this.mouseListenerOffset = function (click) {
        var x = click.clientX;
        var y = click.clientY;
        this.MouseOffset = {x: x - this.bounding.x, y: y - this.bounding.y};
        var event = new CustomEvent("Interaction", {detail: "offset"});
        window.dispatchEvent(event);
    }.bind(this);
    
    this.eventListener = function (event){
        this.Element = $(event.target);
        this.Event = event;
        var event = new CustomEvent("Interaction", {detail: "event"});
        window.dispatchEvent(event);
    }.bind(this);
    
    this.OffsetOnMouseClick = function () {
        $("#" + this.MainCanvasID).click(this.mouseListenerOffset);
    };

    this.setListenerGetObject = function () {
        $("#" + this.MainCanvasID).click("click",this.mouseListenerObject);
    };


    this.clearListeners = function () {
        $("#" + this.MainCanvasID).unbind("click",this.mouseListenerOffsetOnMouseClick);
        $("#" + this.MainCanvasID).unbind("click",this.mouseListenerObject);
         $(document).unbind("click",this.EventListener);
    };
    
    this.setEventListener = function(){
        $(document).click(this.eventListener);
    };
    
    this.assertTrue = function (condition) {
        if (!condition) {
            throw "Failure - should be true";
        }
    };
        
    this.assertFalse = function (condition) {
        if (condition) {
            throw "Failure - should be false";
        }
    };
    this.assertEqual = function (object, object2) {
        if (object !== object2) {
            throw "Failure - objects should be equal";
        }
    };
};

var guitest = new GuiTester();








