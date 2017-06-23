/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectOfGlobal;
var MouseOffset;
var Global = window.InitGlobal();
var GlobalID = window.InitGlobalID();
var event = new CustomEvent("Interaction", {detail: "canvas"});
window.dispatchEvent(event);
var bounding = document.getElementById(GlobalID).getBoundingClientRect();



var mouseListenerObject = function (event){
        var x = event.clientX;
        var y = event.clientY;
        ObjectOfGlobal = Global.getObjectAtOffset(x - bounding.x, y - bounding.y);
        var event = new CustomEvent("Interaction", {detail: "object"});
        window.dispatchEvent(event);
    };
    
var mouseListenerOffsetOnMouseClick = function (event){
        var x = event.clientX;
        var y = event.clientY;
        MouseOffset = {x:x - bounding.x, y:y - bounding.y};
        var event = new CustomEvent("Interaction", {detail: "offset"});
        window.dispatchEvent(event);
    };

function OffsetOnMouseClick(){
    $("#"+GlobalID).click(mouseListenerOffsetOnMouseClick);
}   

function unsetOffsetOnMouseClick(){
    $("#"+GlobalID).unbind("click",mouseListenerOffsetOnMouseClick);
}   

function setListenerGetObject(){
    $("#"+GlobalID).click(mouseListenerObject);
}

function unsetListenerGetObject(){
    $("#"+GlobalID).unbind("click", mouseListenerObject);
}

function clearListeners(){
   unsetListenerGetObject();
   unsetListenerGetCopy();
   unsetOffsetOnMouseClick();
}
function assert(condition, message){
    if(!condition){
        throw message;
    }
}




