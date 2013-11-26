/*
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
*/

// matrix size is 10 x 7

function stringToMatrix(str) {
    /*
    var tokens = str.split();

    if (tokens.length != 70)
        return null;

    var m = [];
    for (var i = 0; i < 7; i++) {
        m.push([]);
        for (var j = 0; j < 10; j++)
            m[i].push(
    return m;
    */
}

function matrixToString(matrix) {
    var str = '';
    for (var i = 0; i < matrix.length; i++) {
        str += matrix[i];
        str += (i % 10 == 9) ? '\n' : ' ';
    }
    return str;
}

document.addEventListener('DOMContentLoaded', function () {
    var matrixTextArea = document.getElementById('matrixTextArea');
    var saveButton = document.getElementById('saveButton');
    var autoFillButton = document.getElementById('autoFillButton');
    var matrixErrorSpan = document.getElementById('matrixErrorSpan');

    var m;

    chrome.storage.sync.get('loginMatrix', function (result) {
        m = result.loginMatrix;
        if (m) {
            matrixTextArea.value = matrixToString(m);
            console.log('loaded matrix from storage');
        }

        saveButton.disabled = false;
        autoFillButton.disabled = false;
    });

    saveButton.addEventListener('click', function () {
        var tokens = matrixTextArea.value.split(/\s+/);
        if (tokens.length != 70) {
            matrixErrorSpan.style.visibility = 'visible';
            console.log('matrix length: ' + tokens.length);
            return;
        }

        m = tokens;

        chrome.storage.sync.set({'loginMatrix': m}, function () {
            matrixErrorSpan.style.visibility = 'hidden';
            console.log('saved!');
        });
    });

    autoFillButton.addEventListener('click', function () {
        chrome.tabs.executeScript(null, {
            code: 'var m = ' + JSON.stringify(m)
        }, function() {
            chrome.tabs.executeScript(null, {file: 'content_script.js'});
        });
        console.log('auto-filled!');
    });
});

