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
                elem.type = 'text';
                elem.tabIndex = cols * rows - (cols * i + j);
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
        });
        
        saveButton.disabled = true;
        editButton.disabled = false;
    });

    editButton.addEventListener('click', function () {
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = !inputs[i].disabled;
            inputs[i].value = (inputs[i].disabled)
                ? '*'
                : '';
        }

        saveButton.disabled = !saveButton.disabled;
        editButton.value = (saveButton.disabled)
            ? 'Edit'
            : 'Cancel';

        inputs[inputs.length - 1].focus();
    });
});

document.onkeypress = function(e) {
    var kc = e.keyCode || e.which;
    var elem = document.activeElement;

    // Check if not in table.
    if (elem.tabIndex <= 0 || elem.tabIndex > 70)
        return;

    elem = elem.parentNode;

    // End of table row reached.
    if (elem.nextSibling == null) {

        // End of table reached.
        if (elem.parentNode.nextSibling == null)
            return;
        
        // Set elem to the first input cell in the next row.
        elem = elem.parentNode.nextSibling.firstChild;
    }

    elem.nextSibling.firstChild.focus();
}

