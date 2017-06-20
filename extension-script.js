/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectOz;
var Global = window.InitGlobal();
var GlobalID = window.InitGlobalID();
var event = new CustomEvent("CanvasReference", {detail: "canvas"});
window.dispatchEvent(event);



var mouseListenerObject = function (event){
        var x = event.clientX;
        var y = event.clientY;
        ObjectOz = Global.getObjectAtOffset(x, y);
        var event = new CustomEvent("ObjectReference", {detail: "object"});
        window.dispatchEvent(event);
    };

var mouseListenerCopy = function (event){
        var x = event.clientX;
        var y = event.clientY;
        ObjectOz = JSON.parse(JSON.stringify(ObjectOz));
    };
    

function getObjectID(object){
    return object;
}

function selectObjectByID(object){
    ;
}

function selectObjectAtOffset(object){
    
}

function setListenerGetObject(){
    $("#"+GlobalID).click(mouseListenerObject);
}

function unsetListenerGetObject(){
    $("#"+GlobalID).unbind("click", mouseListenerObject);
}

function setListenerGetCopy(){
    $("#"+GlobalID).click(mouseListenerCopy);
}

function unsetListenerGetCopy(){
    $("#"+GlobalID).unbind("click", mouseListenerCopy);
}

function clearListeners(){
   unsetListenerGetObject();
   unsetListenerGetCopy();
}
function assert(condition, message){
    if(!condition){
        throw message;
    }
}




