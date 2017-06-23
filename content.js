var id = "[CONTENT SCRIPT] ";


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

ContentController.prototype.showDevtools = function () {
    var event = new KeyboardEvent("keydown");
    event.ctrlKey = true;
    event.shiftKey = true;
    event.keyCode = 105;
    event.which = 105;
    window.dispatchEvent(event);
    console.log(event);
};


ContentController.prototype.setListener = function () {
    window.addEventListener("Interaction", function (event) {
        chrome.runtime.sendMessage({detail: event.detail});
        console.log(id + event.detail + "sended");
    }.bind(this));
};

ContentController.prototype.injectScript = function (file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
};



$(document).ready(function (event) {
    var conController = new ContentController();
    conController.getPageBasic();
    $("body").css("cursor", "crosshair");
    conController.showDevtools();
    conController.injectScript(chrome.extension.getURL('extension-script.js'), 'body');
});


















