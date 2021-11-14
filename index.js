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

const setWord = (content) => {
    const elem = document.querySelector(".word");
    if(!elem) {
        return;
    }
    let len = Math.min(content.length, 12);
    len = Math.max(len, 1);

    elem.style.setProperty('--word-scale', `${20.0/len}rem`);
    elem.innerHTML = content;
}

const startWordPrepare = (words, setTimer) => {
    const pickedWord = words?.[Math.floor(Math.random()*words.length)] || "XXX";


    setWord(pickedWord);
    setElemClass({ selector: ".timer", value: "blue" });

    setTimer({ after: () => startWordCountdown(pickedWord, setTimer), delay: 3});
};

const startWordCountdown = (pickedWord, setTimer) => {
    setWord("XXX");

    setTimer({ after: () => wordReveal(pickedWord), delay: MAX_DELAY});
};

const wordReveal = (pickedWord) => {
    setWord(pickedWord);
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
