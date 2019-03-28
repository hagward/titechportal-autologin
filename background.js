// todo: check content as well as url
var urlIdent = 'https://portal.nap.gsic.titech.ac.jp/GetAccess/Login'
             + '?Template=idg_key&AUTHMETHOD=IG';

// List representation of the login matrix.
var m;

chrome.storage.sync.get('loginMatrix', function (result) {
    m = result.loginMatrix;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    // For now there's only one data structure that is stored, so we can be
    // quite sure that that's the modified one.
    m = changes.loginMatrix.newValue;
});

chrome.pageAction.onClicked.addListener(function (tab) {
    if (!m) return;

    chrome.tabs.executeScript(tab.id, {
        code: 'var m = ' + JSON.stringify(m)
    }, function() {
        chrome.tabs.executeScript(tab.id, {file: 'jquery-3.3.1.slim.min.js'}, function() {
            chrome.tabs.executeScript(tab.id, {file: 'content_script.js'});
        });
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.lastIndexOf(urlIdent, 0) === 0)
        chrome.pageAction.show(tabId);
});

