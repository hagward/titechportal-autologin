// Creates a new table element with the specified number of rows and columns
// and inserts it into the document. The first row and column contains headers
// displaying "A B C..." and "1 2 3..." respectively, and the rest of the cells
// contains input elements. Finally, it returns a list of the input elements.
function createInputTable(table, rows, cols) {
    var inputs = [];

    for (var i = 0; i < rows + 1; i++) {
        var tr = table.insertRow();
        for (var j = 0; j < cols + 1; j++) {
            var td = tr.insertCell();
            var elem = document.createTextNode(' ');

            // Top letter header.
            if (i == 0 && j != 0) {
                elem = document.createTextNode(String.fromCharCode(64 + j));

            // Left number header.
            } else if (i != 0 && j == 0) {
                elem = document.createTextNode(i);

            // Input field.
            } else if (j != 0) {
                elem = document.createElement('input');
                elem.type = 'text';
                elem.tabIndex = (i - 1) * cols + j;
                inputs.push(elem);
            }

            td.appendChild(elem);
        }
    }

    return inputs;
}

// Checks if all the input elements in the specified list are filled properly,
// i.e. contains exactly one alphanumeric character.
function allFilled(inputs) {
    for (var i = 0; i < inputs.length; i++)
        if (inputs[i].value.length != 1)
            return false;
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    var matrixTable = document.getElementById('matrixTable');
    var saveButton = document.getElementById('saveButton');
    var editButton = document.getElementById('editButton');
    var errorDiv = document.getElementById('errorDiv');
    var successDiv = document.getElementById('successDiv');

    var inputs = createInputTable(matrixTable, 7, 10, false);

    // List representation of the login matrix.
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
            inputs[0].focus();
            editButton.disabled = true;
        }
    });

    saveButton.addEventListener('click', function () {
        if (!allFilled(inputs)) {
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
            return;
        } else {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'block';
        }

        // Reset the matrix before reading the new one.
        // todo: don't reset
        m = [];

        for (var i = 0; i < inputs.length; i++) {
            m.push(inputs[i].value);
            inputs[i].disabled = true;
            inputs[i].value = '*';
        }

        chrome.storage.sync.set({'loginMatrix': m}, null);

        saveButton.disabled = true;
        editButton.disabled = false;
        editButton.value = 'Edit';
    });

    editButton.addEventListener('click', function () {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

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

        inputs[0].focus();
    });

    // This code is responsible for automatically selecting the next input
    // element after the user has filled in one.
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
});
