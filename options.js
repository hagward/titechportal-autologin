// Creates a new table element with the specified number of rows and columns
// and inserts it into the document. The first row and column contains headers
// displaying "A B C..." and "1 2 3..." respectively, and the rest of the cells
// contains input elements. Finally, it returns a list of the input elements.
function createInputTable(table, rows, cols) {
    const inputs = [];

    for (let i = 0; i <= rows; i++) {
        const tr = table.insertRow();
        for (let j = 0; j <= cols; j++) {
            const td = document.createElement((i === 0 || j === 0) ? 'th' : 'td');
            let elem = document.createTextNode(' ');

            // Top letter header.
            if (i === 0 && j !== 0) {
                elem = document.createTextNode(String.fromCharCode(64 + j));

            // Left number header.
            } else if (i !== 0 && j === 0) {
                elem = document.createTextNode(i);

            // Input field.
            } else if (j !== 0) {
                elem = document.createElement('input');
                elem.type = 'text';
                elem.maxLength = 1;
                elem.tabIndex = (i - 1) * cols + j;
                inputs.push(elem);
            }

            td.appendChild(elem);
            tr.appendChild(td);
        }
    }

    return inputs;
}

// Checks if all the input elements in the specified list are filled properly,
// i.e. contains exactly one alphanumeric character.
function allFilled(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length !== 1) {
            return false;
        }
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const matrixTable = document.getElementById('matrixTable');
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');
    const errorDiv = document.getElementById('errorDiv');
    const successDiv = document.getElementById('successDiv');

    const inputs = createInputTable(matrixTable, 7, 10, false);

    // List representation of the login matrix.
    let loginMatrix;

    chrome.storage.sync.get('loginMatrix', (result) => {
        loginMatrix = result.loginMatrix;
        if (loginMatrix) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
                inputs[i].value = '*';
            }
            saveButton.disabled = true;
        } else {
            inputs[0].focus();
            editButton.disabled = true;
        }
    });

    saveButton.addEventListener('click', () => {
        if (!allFilled(inputs)) {
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
            return;
        } else {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'block';
        }

        // Reset the matrix before reading the new one.
        loginMatrix = [];

        for (let i = 0; i < inputs.length; i++) {
            loginMatrix.push(inputs[i].value);
            inputs[i].disabled = true;
            inputs[i].value = '*';
        }

        chrome.storage.sync.set({'loginMatrix': loginMatrix}, null);

        saveButton.disabled = true;
        editButton.disabled = false;
        editButton.value = 'Edit';
    });

    editButton.addEventListener('click',  () => {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        for (let i = 0; i < inputs.length; i++) {
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
    inputs.forEach((input) => input.addEventListener('input', () => {
        let elem = document.activeElement;

        // Ensure user has focused any of the matrix inputs.
        if (elem.tabIndex <= 0 || elem.tabIndex > 70) {
            return;
        }

        elem = elem.parentNode;

        // End of table row reached.
        if (!elem.nextSibling) {

            // End of table reached.
            if (!elem.parentNode.nextSibling) {
                return;
            }

            // Set elem to the first input cell in the next row.
            elem = elem.parentNode.nextSibling.firstChild;
        }

        elem.nextSibling.firstChild.focus();
    }));
});
