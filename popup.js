document.addEventListener('DOMContentLoaded', function () {
    var loginButton = document.getElementById('loginButton');
    var alertDiv = document.getElementById('alertDiv');

    var m;

    chrome.storage.sync.get('loginMatrix', function (result) {
        m = result.loginMatrix;
        if (m) {
            console.log('loaded matrix from storage');
            loginButton.disabled = false;
        } else {
            alertDiv.css.display = 'block';
        }
    });

    loginButton.addEventListener('click', function () {
        chrome.tabs.executeScript(null, {
            code: 'var m = ' + JSON.stringify(m)
        }, function() {
            chrome.tabs.executeScript(null, {file: 'content_script.js'});
        });
    });
});

