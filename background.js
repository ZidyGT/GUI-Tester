var BackPgController = function () {
    this.ports = new Array();
};

BackPgController.prototype.execCon = function () {
    var ref = this;
    chrome.browserAction.onClicked.addListener(function () {
        ref.exec();
    });
};

BackPgController.prototype.exec = function () {
    chrome.tabs.executeScript(null, {file: 'content.js'});
};

BackPgController.prototype.messageListener = function () {
    var ref = this;
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        ref.notifyDevtools(request.detail);
        return true;
    });
};

BackPgController.prototype.notifyDevtools = function (msg) {    
    this.ports.forEach(function (port) {
        port.postMessage({detail: msg});
    });
};

BackPgController.prototype.devTlListener = function () {
    var ref = this;
    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name !== "devtools")
            return;
        ref.pushPort(port);
        console.log("connected" + " " + port.name);
        port.onMessage.addListener(function (msg) {
            // Received message from devtools. Do something:
            console.log('Received message from devtools page' + msg);
        });
    });
};

BackPgController.prototype.pushPort = function (port) {
    this.ports.push(port);
};

BackPgController.prototype.removeConnection = function (port) {
    port.onDisconnect.addListener(function () {
        var i = indexOfPort(port);
        if (i !== -1)
            splicePort(i);
    });
};

BackPgController.prototype.splicePort = function (index) {
    this.ports.splice(index, 1);
};

BackPgController.prototype.indexOfPort = function (port) {
    for (var i = 0; this.ports.length; i++)
        if (this.ports[i] === port)
            return i;
};

var controler = new BackPgController();
controler.execCon();
controler.messageListener();
controler.devTlListener();









