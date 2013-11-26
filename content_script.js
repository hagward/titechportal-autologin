var regex = /CC\"\>\[([A-Z]){1},([0-9]){1}\]/g;
var source = document.getElementsByTagName('body')[0].innerHTML;

var inputs = [
    document.getElementsByName('message3')[0],
    document.getElementsByName('message4')[0],
    document.getElementsByName('message5')[0]
];

var i = 0;
var found;
while (i < 3 && (found = regex.exec(source)) !== null) {
    var x = found[1].charCodeAt(0) - 65;
    var y = parseInt(found[2], 10) - 1;

    if (x < 7 && x >= 0 && y < 10 && y >= 0)
        inputs[i].value = m[x][y];

    i++;
}

document.getElementsByName('OK')[0].click();

