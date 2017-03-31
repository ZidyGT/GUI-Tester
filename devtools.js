console.log("devtools");
chrome.devtools.panels.create("GUI Tester", "icon.png", "panel.html",
        function (extensionPanel) {
            var ExWindow; // Going to hold the reference to panel.html's `window`

            var data = [];
            var port = chrome.runtime.connect({name: 'devtools'});
            port.onMessage.addListener(function (msg) {
                if (ExWindow) {
                    ExWindow.do_something(msg.detail);
                } else {
                    data.push(msg);
                }
            });

            extensionPanel.onShown.addListener(function show(panelWindow) {
                extensionPanel.onShown.removeListener(show); // Run once only
                ExWindow = panelWindow;

                // Release queued data
                var msg;
                while (msg = data.shift())
                    ExWindow.do_something(msg);
                // Just to show that it's easy to talk to pass a message back:
                ExWindow.respond = function (msg) {
                    port.postMessage(msg);
                };
            });
        });




