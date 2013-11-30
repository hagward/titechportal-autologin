function createInputTable(table, rows, cols) {
    var inputs = [];

    for (var i = 0; i < rows + 1; i++) {
        var tr = table.insertRow();
        for (var j = 0; j < cols + 1; j++) {
            var td = tr.insertCell();
            var elem = document.createTextNode(' ');

            // Top letter header.
            if (i == rows && j != cols)
                elem = document.createTextNode(String.fromCharCode(74 - j));

            // Left number header.
            else if (i != rows && j == cols)
                elem = document.createTextNode(7 - i);

            // Input field.
            else if (j != cols) {
                elem = document.createElement('input');
                inputs.push(elem);
            }

            td.appendChild(elem);
        }
    }

    return inputs;
}

document.addEventListener('DOMContentLoaded', function () {
    var matrixTable = document.getElementById('matrixTable');
    var saveButton = document.getElementById('saveButton');
    var editButton = document.getElementById('editButton');

    var inputs = createInputTable(matrixTable, 7, 10, false);

    var m;

    chrome.storage.sync.get('loginMatrix', function (result) {
        m = result.loginMatrix;
        if (m) {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
                inputs[i].value = '*';
            }

            saveButton.disabled = true;
            console.log('loaded matrix from storage');
        } else {
            inputs[inputs.length - 1].focus();
        }
    });

    saveButton.addEventListener('click', function () {
        m = [];
        for (var i = inputs.length - 1; i >= 0; i--) {
            m.push(inputs[i].value);
            inputs[i].disabled = true;
            inputs[i].value = '*';
        }

        chrome.storage.sync.set({'loginMatrix': m}, function () {
            console.log('saved!');
            console.log(m);
        });
        
        saveButton.disabled = true;
        editButton.disabled = false;
    });

    editButton.addEventListener('click', function () {
        for (var i = 0; i < inputs.length; i++)
            inputs[i].disabled = !inputs[i].disabled;

        saveButton.disabled = !saveButton.disabled;

        // This does not work...
        editButton.value = (saveButton.disabled)
            ? 'Edit'
            : 'Cancel';

        inputs[inputs.length - 1].focus();
    });
});

