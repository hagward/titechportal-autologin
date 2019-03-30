var regex = /CC\"\>\[([A-Z]){1},([0-9]){1}\]/g;
var source = document.getElementsByTagName('body')[0].innerHTML;

var inputs = document.querySelectorAll('input[name^="message"][type="password"]');

if (inputs[0] && inputs[1] && inputs[2]) {
    var i = 0;
    var found;

    while (i < 3 && (found = regex.exec(source)) !== null) {
        var x = found[1].charCodeAt(0) - 65;
        var y = parseInt(found[2], 10) - 1;

        if (x < 10 && x >= 0 && y < 7 && y >= 0)
            inputs[i].value = m[y*10 + x]; // m is injected from background.js

        i++;
    }

    document.getElementsByName('OK')[0].click();
}

