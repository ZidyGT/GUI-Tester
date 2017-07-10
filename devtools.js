var id = "[DEVTOOLS PAGE] ";

var DevtoolsController = function (name, icon, panel) {
    this.ExWindow; // odkaz na okno pro tvorbu sc�n���
    this.port;
    this.connection;
    this.ExPanel;
    this.hasListener = false;
    
    if (!(chrome.devtools.inspectedWindow.tabId === null))//pro pot�ebu testov�n�
        chrome.devtools.panels.create(name, icon, panel, this.Init.bind(this));
    
    this.messageListener = function (msg) {
         chrome.devtools.inspectedWindow.eval(id + "console.log('object received');");
        if (msg.detail === "canvas")
        {
            this.ExWindow.controller.insertCommandCanvas();
        } else if (msg.detail === "object") {
            this.ExWindow.controller.insertCommandObject();
        } else if (msg.detail === "offset") {
            this.ExWindow.controller.insertCommandOffset();
        }    
        else if (msg.detail === "event") {
            this.ExWindow.controller.insertEvent();
        }  
    }.bind(this);
};

DevtoolsController.prototype.Init = function (ExtensionPanel) {
    this.ExPanel = ExtensionPanel;
    chrome.devtools.inspectedWindow.eval("console.log('" + id + JSON.stringify(this.ExPanel) + "')");
    this.port = "devtools-gui " + chrome.devtools.inspectedWindow.tabId.toString();
    this.connection = chrome.runtime.connect({name: this.port});
    ExtensionPanel.onShown.addListener(this.Viewing.bind(this));
    ExtensionPanel.onHidden.removeListener(this.Viewing.bind(this));
};



DevtoolsController.prototype.Viewing = function (panelWindow) {
    this.connection.postMessage({detail: "init"});
    chrome.devtools.inspectedWindow.eval(id + "console.log('devtool showed');");
    this.ExWindow = panelWindow;
    if(this.ExWindow && this.hasListener === false){
                this.connection.onMessage.addListener(this.messageListener);
                this.hasListener = true;
    }
};


var Devcontrol = new DevtoolsController("GUI Tester", "icon.png", "panel.html");







