/*
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
0 9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9 0
*/

function parseMatrix(matrixStr) {
    // matrix size is 10 x 7

    var m = [];
    for (var i = 0; i < 7; i++)
        m.push(matrixStr.substr(i*20).split(/\s+/));
    return m;
}

function matrixToString(matrix) {
    console.log(matrix[0].join(''));
}

document.addEventListener('DOMContentLoaded', function () {
    var matrixTextArea = document.getElementById('matrixTextArea');
    var saveButton = document.getElementById('saveButton');
    var autoFillButton = document.getElementById('autoFillButton');

    var m;

    chrome.storage.sync.get('loginMatrix', function (result) {
        m = result.loginMatrix;
        matrixTextArea.value = m.toString();

        saveButton.disabled = false;
        autoFillButton.disabled = false;

        console.log('loaded matrix from storage');
        matrixToString(m);
    });

    saveButton.addEventListener('click', function() {
        m = parseMatrix(matrixTextArea.value);
        chrome.storage.sync.set({'loginMatrix': m}, function () {
            console.log('saved!');
        });
    });

    autoFillButton.addEventListener('click', function() {
        chrome.tabs.executeScript(null, {
            code: 'var m = ' + JSON.stringify(m)
        }, function() {
            chrome.tabs.executeScript(null, {file: 'content_script.js'});
        });
        console.log('auto-filled!');
    });
});

