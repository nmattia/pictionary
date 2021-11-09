let word = document.querySelector("#word");
let newWord = document.querySelector("#newWord");
let timer = document.querySelector("#timer");
let words;
fetch('./words.json')
    .then(response => response.json())
    .then(data => {
        newWord.removeAttribute("disabled");
        words = data.words;
    } );

function startWordPrepare() {
    const pickedWord = words[Math.floor(Math.random()*words.length)];
    word.innerHTML = pickedWord;
    timer.className  = "blue";
    setTimer((d) => { timer.innerHTML = `${d}` }, () => {startWordCountdown(pickedWord)}, 3);
}

function startWordCountdown(pickedWord) {
    word.innerHTML = "XXX"
    setTimer((d) => { timer.innerHTML = `${d}` }, () => {wordReveal(pickedWord)}, 30);
}

function wordReveal(pickedWord) {
    word.innerHTML = pickedWord;
    timer.innerHTML = "TIME OUT";
}

function setTimer(during, after, delay) {
    if(delay === 0) {
        return after();
    } else {
        during(delay);
        setTimeout(() => setTimer(during, after, delay -1), 1000);
    }
}

newWord.onclick = () => startWordPrepare();
