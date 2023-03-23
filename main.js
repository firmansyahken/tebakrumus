const timer = document.querySelector(".time_value");
const quest = document.querySelector(".quest");
var answer = document.querySelector(".answer");

var data = [];
var current = 0;
var score = 0;
var duration = 10;
var counter = duration;
var progress = 100;

function Play() {
    Bgm(true);
    document.querySelector(".preloader").classList.add("disable");
    getData();
}

async function getData() {
    const fetchData = await fetch("data.json");
    const response = await fetchData.json()
    data = response.quests;
    renderData()
    Timer()
}

function renderData() {
    timer.style.width = "100%";
    let currentQuest = data[current];
    quest.innerHTML = `<img src="${currentQuest.image}" alt="quest"/>
        <h2>${currentQuest.quest}</h2>`;
    currentQuest.answer.map(ans => {
        answer.innerHTML += `<button class="answer_button">${ans}</button>`;
    })

    let answerButton = document.querySelectorAll(".answer_button");
    answerButton.forEach(btn => {
        btn.addEventListener("click", Correction)
    })
    
}

function Correction() {
    Sfx("sounds/click.mp3");
    let correct = data[current].correct;
    let key = this.innerText;
    console.log(key, correct);

    if (key === correct) {
        score += 1;
    } 

    if (current >= data.length - 1) {
        return gameOver();
    }

    current += 1;
    progress = 100;
    counter = duration;
    clearElement();
    renderData();
    
}

function Timer() {
    const times = setInterval(() => {
        if(counter <= 0) {
            if (current >= data.length - 1) {
                gameOver();
                return clearInterval(times);
            }
            current += 1;
            clearElement();
            renderData();
            progress = 100;
            counter = duration;
        }
        if (current >= data.length - 1) {
            return counter = duration;
        }
        counter -= 1
        console.log(counter);
        timer.style.width = `${progress -= 100 / duration}%`;
    }, 1000)

}

function gameOver() {
    Bgm(false)
    Sfx("sounds/end.mp3");
    let finalScore = (100 / data.length) * score
    document.getElementById("score").innerText = finalScore;
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".game_over").classList.add("active");
    document.getElementById("exit").addEventListener("click", function() {
        window.location.href = "https://google.com"
    });
}

function Bgm(state) {
    const music = new Audio("sounds/backsound.mp3");
    music.currentTime = 1;
    music.volume = 0.7;
    music.loop = true;
    if(state == false) {
        return music.pause();
    }
    music.play();
}

function Sfx(src) {
    const sfx = new Audio(src);
    return sfx.play();
}

function clearElement() {
    answer.innerHTML = "";
}
