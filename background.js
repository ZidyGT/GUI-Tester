chrome.browserAction.onClicked.addListener(function(){
    start();
});

function start(){
    chrome.tabs.executeScript(null, {file: 'content.js'});
}