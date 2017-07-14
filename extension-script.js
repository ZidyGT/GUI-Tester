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
    var clientRect = document.getElementById(this.MainCanvasID).getBoundingClientRect();
    this.bounding = {x:clientRect.left, y:clientRect.top};

    this.mouseListenerObject = function (click) {
        var x = click.clientX;
        var y = click.clientY;
        ObjectOfCanvas = MainCanvas.getObjectAtOffset(x - this.bounding.x, y - this.bounding.y);
        var event = new CustomEvent("Interaction", {detail: "object"});
        window.dispatchEvent(event);
    };

    this.mouseListenerOffset = function (click) {
        var x = click.clientX;
        var y = click.clientY;
        this.MouseOffset = {x: x - this.bounding.x, y: y - this.bounding.y};
        var event = new CustomEvent("Interaction", {detail: "offset"});
        window.dispatchEvent(event);
    };
    
    this.doClick = function(){
        var element = $("<img>");
        element.attr({id : "guitest-highlight"});
        element.css({position:"absolute", left:this.offset.x, top:this.offset.y});
        $("body").append(element);
    };
    
    
    this.userListener = function (event){
        var x = event.clientX;
        var y = event.clientY;
        this.offset = {x:x, y:y};
        var event = new CustomEvent("Interaction", {detail: "user"});
        window.dispatchEvent(event);
    };
    
    this.OffsetOnMouseClick = function () {
        $("#" + this.MainCanvasID).click(this.mouseListenerOffset.bind(this));
    };

    this.setListenerGetObject = function () {
        $("#" + this.MainCanvasID).click("click",this.mouseListenerObject.bind(this));
    };
    
    this.setListenerUserAction = function () {
        $("#" + this.MainCanvasID).click("click",this.userListener.bind(this));
    };


    this.clearListeners = function () {
        $("#" + this.MainCanvasID).unbind("click",this.mouseListenerOffsetOnMouseClick);
        $("#" + this.MainCanvasID).unbind("click",this.mouseListenerObject);
         $(document).remove("#guitest-highlight");
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








