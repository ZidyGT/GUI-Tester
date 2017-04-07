function sendDataToExtension(key, value) {
    var dataObj = {"key":key, "value":value};
    var storeEvent = new CustomEvent('myStoreEvent', {"detail":dataObj});
    document.dispatchEvent(storeEvent);
}

function sendDataToExtension(key, value) {
    // as above
}

// since this script is running, myapi.js has loaded, so let the page know
var customAPILoaded = new CustomEvent('customAPILoaded');
document.dispatchEvent(customAPILoaded);


