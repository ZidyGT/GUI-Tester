var ContentController = function (panel) {
    this.panel = panel;
    this.title;
    this.pagetTitle;
    this.port;
    this.pageObjects = new Array();
};

ContentController.prototype.checkPanel = function () {
    var check = $("body").find("#" + this.panel).length;
    if (check === 0)
        return true;
    else
        return false;
};

ContentController.prototype.getPageBasic = function () {
    var dom = $(":root");
    this.title = $(dom).find("title").text();
    this.pageTitle = $(dom).find("h1").first().text();
    console.log("Vítejte GUI Tester");
    console.log("Stránka s titulkem " + this.title);
    console.log("Stránka s nadpisem " + this.pageTitle);
};

ContentController.prototype.loadPanel = function (html) {
    try {
        $("body").prepend(html);
        this.setListener();
    } catch (err) {
        console.log(err.message);
    }
};

ContentController.prototype.insertPanel = function ()
{
    var url = chrome.extension.getURL("scenare.html");
    var ref = this;
    $.get(url, function (data) {
        ref.loadPanel(data);
    });
};

ContentController.prototype.setMonitor = function () {
    var event = new CustomEvent("init", {});
    window.dispatchEvent(event);
};

ContentController.prototype.setListener = function () {
    var ref = this;
    window.addEventListener("ObjectReference", function (event) {
        if (!ref.hasDetail(event.detail.obj))
        {
            ref.notifyBackPage(event.detail);
            ref.pageObjects.push(event.detail.obj);
        }
    });
    this.setMonitor();
};

ContentController.prototype.notifyBackPage = function (msg) {
    chrome.runtime.sendMessage({detail: msg});
};

ContentController.prototype.hasDetail = function(object){
    for(var i=0; i < this.pageObjects.length;i++){
        if (
                (this.pageObjects[i].x === object.x)
                &&
                (this.pageObjects[i].y === object.y)
                )
        {
            return true;
        }
    }
    return false;
};



$(document).ready(function (event) {
    var conController = new ContentController("GUITester");
    if (conController.checkPanel()) {
        conController.getPageBasic();
        conController.insertPanel();
        $("body").css("cursor", "crosshair");

    }
});












