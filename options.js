document.addEventListener('DOMContentLoaded', function () {
    var matrixTable = document.getElementById('matrixTable');

    // Create the matrix table.
    for (var i = 0; i < 8; i++) {
        var tr = matrixTable.insertRow();
        for (var j = 0; j < 11; j++) {
            var td = tr.insertCell();
            var elem = document.createTextNode(' ');

            // Top letter header.
            if (i == 7 && j != 10)
                elem = document.createTextNode(String.fromCharCode(74 - j));

            // Left number header.
            else if (i != 7 && j == 10)
                elem = document.createTextNode(7 - i);

            // Input field.
            else if (j != 10)
                elem = document.createElement('input');

            td.appendChild(elem);
        }
    }

    // Set focus to the first input field.
    matrixTable.getElementsByTagName('input')[0].focus();
});

