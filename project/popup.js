// DOM elements
let countTimer = document.getElementById('counter');
let leftBtn = document.getElementById('button1');
let midBtn = document.getElementById('middlebutton');
let middleDiv = document.getElementById('middlediv');
let rightBtn = document.getElementById('button2');

// Timer variables
let lb = 0;
let myInterval, remainingTime, previousTimer;
let isPaused = true;
let defaultTimer = 25;

// Check for localStorage support
if (typeof(Storage) !== "undefined") {
    let storedTimer = localStorage.timer;

    if (storedTimer && storedTimer > 0) {
        defaultTimer = parseInt(storedTimer);
    } else {
        localStorage.timer = 25;
    }
} else {
    alert('Unsupported browser');
}

// Initialize midBtn listener
midBtnInitialize();

// Check for localStorage.pause
let storedPause = localStorage.pause;
isPaused = storedPause && storedPause.localeCompare('false') === 0 ? false : true;

// Check for stored previous time state
let storedPrevTimer = localStorage.prevtimer;
if (storedPrevTimer && storedPrevTimer.localeCompare('true') === 0) {
    let date = new Date(0);
    previousTimer = true;

    if (isPaused) {
        remainingTime = parseInt(localStorage.remain);
        date.setSeconds(remainingTime / 1000);
        countTimer.innerHTML = date.toISOString().substring(14, 19);
    } else {
        remainingTime = parseInt(localStorage.realtime);
        date.setSeconds((remainingTime - Date.now()) / 1000);
        countTimer.innerHTML = date.toISOString().substring(14, 19);
        toggleButtons(0);
        startTimer();
    }
} else {
    previousTimer = false;
    countTimer.innerHTML = defaultTimer + ':00';
}

// Event listeners
leftBtn.addEventListener('click', () => {
    if (isPaused && lb === 0) {
        lb++;
        middlediv.innerHTML = `
        <input id="inputtime" type="number" min="1" max="60" size="4" placeholder="${defaultTimer}">
        </input><div id="counter">:00</div>`;
        rightBtn.style.visibility = 'hidden';
    } else {
        lb--;
        let inputTime = parseInt(document.getElementById('inputtime').value);
        if (inputTime > 0 && inputTime < 60 && inputTime !== defaultTimer) {
            defaultTimer = inputTime;
            localStorage.timer = defaultTimer;
            previousTimer = false;
            localStorage.prevtimer = false;
            middlediv.innerHTML = `<button id="middlebutton" class="buttons">
            <div id="counter">${defaultTimer}:00</div></button>`;
            resetRightBtn();
            return;
        } else if (previousTimer && isPaused) {
            let date = new Date(0);
            date.setSeconds(remainingTime / 1000);
            middlediv.innerHTML = `<button id="middlebutton" class="buttons">
            <div id="counter">${date.toISOString().substring(14, 19)}</div></button>`;
            resetRightBtn();
            return;
        }

        middlediv.innerHTML = `<button id="middlebutton" class="buttons">
        <div id="counter">${defaultTimer}:00</div></button>`;
        resetRightBtn();
    }
});

rightBtn.addEventListener('click', () => {
    if (lb === 0 && isPaused) {
        resetPrevTime();
        countTimer.innerHTML = defaultTimer + ':00';
        localStorage.removeItem('remain');
        localStorage.removeItem('realtime');
    }
});

// Timer interval
function startTimer() {
    let targetTime = previousTimer ? remainingTime : Date.now() + defaultTimer * 60000;
    localStorage.realtime = targetTime;

    myInterval = setInterval(() => {;
        let remaining = targetTime - Date.now() + 1000;
        let date = new Date(0);

        if (remaining < 1000) {
            remainingTime = 0;
            countTimer.innerHTML = date.toISOString().substring(14, 19);
            clearInterval(myInterval);
            toggleButtons(1);
            resetPrevTime();
            return;
        }

        remainingTime = remaining;
        localStorage.remain = remaining;
        date.setSeconds(remaining / 1000);
        countTimer.innerHTML = date.toISOString().substring(14, 19);
    }, 1000)
}

// Toggle button visibility
function toggleButtons(num) {
    if (num === 0) {
        leftBtn.style.visibility = 'hidden';
        leftBtn.style.cursor = 'default'
        rightBtn.style.visibility = 'hidden';
        rightBtn.style.cursor = 'default'
    } else {
        leftBtn.style.visibility = 'visible';
        leftBtn.style.cursor = 'pointer'
        rightBtn.style.visibility = 'visible';
        rightBtn.style.cursor = 'pointer'
    }
}

// Reset previous time
function resetPrevTime() {
    isPaused = true;
    localStorage.pause = true;
    previousTimer = false;
    localStorage.prevtimer = false;
}

// Reset buttons and count timer
function resetRightBtn() {
    rightBtn.style.visibility = 'visible';
    rightBtn.style.cursor = 'pointer';
    rightBtn = document.getElementById('button2');
    countTimer = document.getElementById('counter');
    midBtn = document.getElementById('middlebutton');
    midBtnInitialize();
}

function midBtnInitialize() {
    midBtn.addEventListener('click', () => {
        if (isPaused) {
            if (previousTimer) {
                chrome.runtime.sendMessage({ remain: remainingTime });
                isPaused = false;
                localStorage.pause = false;
                let t = Date.now() + remainingTime;
                localStorage.realtime = t;
                remainingTime = t;
                startTimer();
                toggleButtons(0);
            } else {
                chrome.runtime.sendMessage({ timer: defaultTimer });
                startTimer();
                toggleButtons(0);
                isPaused = false;
                localStorage.pause = false;
                previousTimer = true;
                localStorage.prevtimer = true;
            }
        } else {
            chrome.runtime.sendMessage({clear: true});
            toggleButtons(1);
            clearInterval(myInterval);
            isPaused = true;
            localStorage.pause = true;
        }
    });
}