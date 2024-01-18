chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.timer) {
        createAlarm(request.timer * 60);
    }
    else if (request.clear) {
        chrome.alarms.clearAll();
    }
    else if (request.remain) {
        createAlarm((request.remain / 1000) + 1000)
    }
})

chrome.alarms.onAlarm.addListener(() => {
    chrome.notifications.create(
        {
            type: "basic",
            iconUrl: "images/icon.png",
            title: "Pomo",
            message: "Time's up!",
            silent: false
        },
    )},
);

function createAlarm(s) {
    chrome.alarms.create("pom", {
        delayInMinutes: s / 60
    });
}