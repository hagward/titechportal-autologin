function autoFillForm(loginMatrix) {
    const regex = /CC\"\>\[([A-Z]){1},([0-9]){1}\]/g;
    const source = document.getElementsByTagName('body')[0].innerHTML;
    const inputs = document.querySelectorAll('input[name^="message"][type="password"]');
    const submit = document.getElementsByName('OK')[0];

    if (inputs[0] && inputs[1] && inputs[2]) {
        let i = 0;
        let found;

        while (i < 3 && (found = regex.exec(source)) !== null) {
            const x = found[1].charCodeAt(0) - 65;
            const y = parseInt(found[2], 10) - 1;

            if (x < 10 && x >= 0 && y < 7 && y >= 0) {
                inputs[i].value = loginMatrix[y*10 + x];
            }

            i++;
        }

        if (submit) {
            submit.click();
        }
    }
}

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('loginMatrix', (result) => {
        if (!result.loginMatrix) return;
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: autoFillForm,
            args: [result.loginMatrix]
        });
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        const rule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'portal.nap.gsic.titech.ac.jp', schemes: ['https'] },
                    css: ['input[name^="message"][type="password"]']
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };
        chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
});
