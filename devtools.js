var id = "[DEVTOOLS PAGE] ";

var DevtoolsController = function (name, icon, panel) {
    this.ExWindow; // odkaz na okno pro tvorbu sc�n���
    this.port;
    this.connection;
    this.ExPanel;
    if (!(chrome.devtools.inspectedWindow.tabId === null))//pro pot�ebu testov�n�
        chrome.devtools.panels.create(name, icon, panel, this.Init.bind(this));
};

DevtoolsController.prototype.Init = function (ExtensionPanel) {
    this.ExPanel = ExtensionPanel;
    chrome.devtools.inspectedWindow.eval("console.log('" + id + JSON.stringify(this.ExPanel) + "')");
    this.port = "devtools-gui " + chrome.devtools.inspectedWindow.tabId.toString();
    this.connection = chrome.runtime.connect({name: this.port});
    ExtensionPanel.onShown.addListener(this.Viewing.bind(this));
};



DevtoolsController.prototype.Viewing = function (panelWindow) {
    this.connection.postMessage({detail: "init"});
    chrome.devtools.inspectedWindow.eval(id + "console.log('devtool showed');");
    this.ExWindow = panelWindow;
    if(this.ExWindow)
    this.connection.onMessage.addListener(function (msg) {
            chrome.devtools.inspectedWindow.eval(id + "console.log('object received');");
        if (msg.detail === "canvas")
        {
            this.ExWindow.panel.insertCommandCanvas();
        } else if (msg.detail === "object") {
            this.ExWindow.panel.insertCommandObject();
        }
    }.bind(this));
    this.ExPanel.onShown.removeListener(this.Viewing.bind(this));
};

var Devcontrol = new DevtoolsController("GUI Tester", "icon.png", "panel.html");







