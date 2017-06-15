var id = "[BACKGROUND PAGE] ";

var BackPgController = function () {
    this.ports = new Array();
};

BackPgController.prototype.execCon = function () {
    chrome.browserAction.onClicked.addListener(function () {
        this.exec();
    }.bind(this));
};

BackPgController.prototype.exec = function () {
    chrome.tabs.executeScript(null, {file: 'content.js'});
};

BackPgController.prototype.messageListener = function (request, sender, sendResponse) {
        console.log(id + "receive " + JSON.stringify(request.detail));
        this.notifyDevtools(request.detail);
        return true;
};

BackPgController.prototype.notifyDevtools = function (msg) { 
        for(var i = 0; i < this.ports.length; i++)
        {
            this.ports[i].postMessage(msg); 
            console.log(id + "sending " + JSON.stringify(msg)+ " na port " + this.ports[i].name);
        }
};


BackPgController.prototype.devTlListener = function () {
    chrome.runtime.onConnect.addListener(function (port) {
        var patt = /devtools-gui/;
        if (!patt.test(port.name))
            return;
        else
        {
            console.log(id + "connected to " + port.name);
            this.pushPort(port);
            if(!chrome.runtime.onMessage.hasListener(this.messageListener.bind(this)))
            {
                chrome.runtime.onMessage.addListener(this.messageListener.bind(this));             
            }
            console.log(chrome.runtime.onMessage.hasListener(this.messageListener.bind(this)));
            console.log(this.ports);
            this.removeConnection(port);  
        }
    }.bind(this));
};

BackPgController.prototype.pushPort = function (port) {
    if(!this.hasPort(port))
    this.ports.push(port);
};

BackPgController.prototype.removeConnection = function (port) {
    port.onDisconnect.addListener(function () {
        if(chrome.runtime.onMessage.hasListener(this.messageListener.bind(this))){
            chrome.runtime.onMessage.removeListener(this.messageListener.bind(this));        
        }
        console.log(chrome.runtime.onMessage.hasListener(this.messageListener.bind(this)));
        console.log(id + "dissconnected to " + port.name);
        this.remove(port);
        console.log(this.ports);
    }.bind(this));
};

BackPgController.prototype.hasPort= function (port) {   
    for(var i=0; i < this.ports.length; i++)
    {
        if(this.ports[i].name === port.name)
            return true;
    }
    return false;
};

BackPgController.prototype.indexPort= function (port) {   
    for(var i=0; i < this.ports.length; i++)
    {
        if(this.ports[i].name === port.name)
            return i;
    }
    return -1;
};

BackPgController.prototype.splicePort = function (index) {
    this.ports.splice(index, 1);
};

BackPgController.prototype.remove = function (port) {
    var i  = this.indexPort(port);
    if(i !== -1)
        this.splicePort(i);
};


var controler = new BackPgController();
controler.execCon();
controler.devTlListener();











