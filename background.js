var urlIdent = 'https://portal.nap.gsic.titech.ac.jp/GetAccess/Login'
             + '?Template=idg_key&AUTHMETHOD=IG';
//var urlIdent = 'test-site.html';

var m;

chrome.storage.sync.get('loginMatrix', function (result) {
    m = result.loginMatrix;
});

chrome.pageAction.onClicked.addListener(function (tab) {
    if (!m) return;

    chrome.tabs.executeScript(tab.id, {
        code: 'var m = ' + JSON.stringify(m)
    }, function() {
        chrome.tabs.executeScript(tab.id, {file: 'content_script.js'});
    });
    console.log(m);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf(urlIdent) > -1)
        chrome.pageAction.show(tabId);
});

