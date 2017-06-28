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

    this.OffsetOnMouseClick = function () {
        $("#" + this.MainCanvasID).on("click",this.mouseListenerOffset);
    };

    this.setListenerGetObject = function () {
        $("#" + this.MainCanvasID).on("click",this.mouseListenerObject);
    };


    this.clearListeners = function () {
        $("#" + this.MainCanvasID).off("click",this.mouseListenerOffsetOnMouseClick);
        $("#" + this.MainCanvasID).off("click",this.mouseListenerObject);
    };
    this.assert = function assert(condition, message) {
        if (!condition) {
            throw message;
        }
    };
};

var guitest = new GuiTester();








