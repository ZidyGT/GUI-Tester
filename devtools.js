var id = "[DEVTOOLS PAGE] ";

var DevtoolsController = function (name, icon, panel) {
    this.ExWindow; // odkaz na okno pro tvorbu scénáøù
    this.port;
    this.cmCache;
    this.connection;
    this.ExPanel;
    this.cmCache = new Array();
    if (!(chrome.devtools.inspectedWindow.tabId === null))//pro potøebu testování
        chrome.devtools.panels.create(name, icon, panel, this.Init.bind(this));
};

DevtoolsController.prototype.Init = function (ExtensionPanel) {
    this.ExPanel = ExtensionPanel;
    chrome.devtools.inspectedWindow.eval("console.log('" + id + JSON.stringify(this.ExPanel) + "')");
    this.port = "devtools-gui " + chrome.devtools.inspectedWindow.tabId.toString();
    this.connection = chrome.runtime.connect({name: this.port});
    this.connection.onMessage.addListener(this.Caching.bind(this));
    ExtensionPanel.onShown.addListener(this.Viewing.bind(this));
};

DevtoolsController.prototype.Caching = function (msg) {
    if (this.ExWindow) { //uživatel okno pro tvorbu scénáøù již otevøel
        if (typeof (msg) === 'string')
        {
            if (msg === "canvas")
            {
                this.ExWindow.panel.insertCommandCanvas();
            }
        } else
        {
            this.ExWindow.panel.insertCommand(msg);
        }
    } else {
        this.cmCache.push(msg);   
        chrome.devtools.inspectedWindow.eval("console.log('" +  id  + JSON.stringify(this.cmCache) + "')");
    }
     
};

DevtoolsController.prototype.Viewing = function (panelWindow) {
                chrome.devtools.inspectedWindow.eval( id + "console.log('devtool showed');");
                this.ExPanel.onShown.removeListener(this.Viewing.bind(this));
                this.ExWindow = panelWindow;
                chrome.devtools.inspectedWindow.eval(id + "console.log('" + JSON.stringify(this.cmCache) + "');");
                // Release queued data
                for (var i = 0; i < this.cmCache.length; i++)
                {
                    if (typeof (this.cmCache[i]) === 'string') {
                        if (this.cmCache[i] === "canvas")
                        {
                            this.ExWindow.panel.insertCommandCanvas();
                        }
                    } else {
                        this.ExWindow.panel.insertCommand(this.cmCache[i]);
                    }
                }
};

var Devcontrol = new DevtoolsController("GUI Tester", "icon.png", "panel.html");







