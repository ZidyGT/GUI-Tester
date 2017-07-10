var id = "[CONTENT SCRIPT] ";


var ContentController = function () {
    this.title;
    this.pagetTitle;
    this.port;
    this.pageObjects = new Array();
    this.setListener();
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


    var conController = new ContentController();
    //document.getElementsByTagName("body")[0].style.cursor = "crosshair";
    conController.injectScript(chrome.extension.getURL('jquery.min.js'), 'head');
    conController.injectScript(chrome.extension.getURL('extension-script.js'), 'head');



















