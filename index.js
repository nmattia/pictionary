const MAX_DELAY = 30;

const setElemInnerHTML = ({ selector, value}) => {
    const elem = document.querySelector(selector);
    if (!elem) {
        return;
    }

    elem.innerHTML = value;
};

const setElemClass = ({ selector, value}) => {
    const elem = document.querySelector(selector);
    if (!elem) {
        return;
    }

    elem.classList.add(value);
};

const startWordPrepare = (words, setTimer) => {
    const pickedWord = words?.[Math.floor(Math.random()*words.length)];

    setElemInnerHTML({ selector: ".word", value: pickedWord || ""});
    setElemClass({ selector: ".timer", value: "blue" });

    setTimer({ after: () => startWordCountdown(pickedWord, setTimer), delay: 3});
};

const startWordCountdown = (pickedWord, setTimer) => {
    setElemInnerHTML({ selector: ".word", value: "XXX" });

    setTimer({ after: () => wordReveal(pickedWord), delay: MAX_DELAY});
};

const wordReveal = (pickedWord) => {
    setElemInnerHTML({ selector: ".word", value: pickedWord });
    setElemInnerHTML({ selector: ".timer", value: "TIME OUT" });
};

const setTimerCurr = (timeoutId) => ({ after, delay})=> {

    const timer = document.querySelector(".timer");

    if (delay === 0) {
        return after();
    }

    setElemInnerHTML({ selector: ".timer", value: `${delay}`});
    const delayPerc = delay * 100.0 / MAX_DELAY;
    timer.style.setProperty("--percent", `${delayPerc}%`);

    clearTimeout(timeoutId.pop());
    timeoutId[0] = setTimeout(() => setTimerCurr(timeoutId)({ after, delay: delay - 1}), 1000);
};

document.addEventListener("DOMContentLoaded", async () => {
    let newWord = document.querySelector("button");
    let timeoutId = [];

    const response = await fetch('./words.json');
    const { words } = await response.json();
    newWord.addEventListener("click", () => {
        startWordPrepare(words, setTimerCurr(timeoutId));
    }, { passive: true });
    newWord.removeAttribute("disabled");
});
