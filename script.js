//This is the to do list
    //Question Text: Needs id="question-text"
    //Buttons: Needs IDs btn0, btn1, btn2, btn3 and class="StartButton" (to use your purple CSS).
    //Feedback: Needs<p id="feedback"></p
    //score:Needs<span id="score">0</span

    //Go to the bottom of the script: Add }; right after the displayFinalScore(); line and before function shuffle.
    //Go to showQuestion: Delete the duplicate let quiz and let q lines.
    // to saveQuestion: Add the other answer IDs to your if check.

//this is the remove previous questions when closed function guys!
if (!sessionStorage.getItem("sessionStarted")) {
    localStorage.removeItem("quiz");
    sessionStorage.setItem("sessionStarted", "true");
}

let currentQuestionIndex = 0;
let score = 0;

//This is the save questions system guys!!
function saveQuestion() {
    const qInput = document.getElementById("question");
    const a1 = document.getElementById("a1");
    const a2 = document.getElementById("a2");
    const a3 = document.getElementById("a3");
    const a4 = document.getElementById("a4");
    const cIndex = document.getElementById("correctIndex");

    if (!qInput.value || !a1.value || !a2.value || !a3.value || !a4.value) {
    alert("Please fill in all fields!");
    return;
    }

    let newQuestion = {
        id: Date.now(),
        question: qInput.value,
        answers: [a1.value, a2.value, a3.value, a4.value],
        correct: parseInt(cIndex.value) 
    };

    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
        quiz.push(newQuestion);
        localStorage.setItem("quiz", JSON.stringify(quiz));

    alert("Question saved!");
        qInput.value = ""; a1.value = ""; a2.value = ""; a3.value = ""; a4.value = "";

    if (!qInput.value || !a1.value || !a2.value || !a3.value || !a4.value) {
        alert("Please fill in all fields!");
        return;
    }

    let newQuestion = {
        id: Date.now(),
        question: qInput.value,
        answers: [a1.value, a2.value, a3.value, a4.value],
        correct: parseInt(cIndex.value) 
    };

    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    quiz.push(newQuestion);
    localStorage.setItem("quiz", JSON.stringify(quiz));

    alert("Question saved!");
    qInput.value = ""; a1.value = ""; a2.value = ""; a3.value = ""; a4.value = "";
}

//this is the start game method GUYS!!
function startGame() {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    if (quiz.length === 0) {
        window.location.href = "GSAQ.html";
        return;
    }
    quiz = shuffle(quiz);
    localStorage.setItem("quiz", JSON.stringify(quiz));
    showQuestion();
}

//this is the show questions method guys!!
function showQuestion() {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    let q = quiz[currentQuestionIndex];

    const progressText = document.getElementById("progress-text");
    if(progressText) {
        progressText.innerText = "Question " + (currentQuestionIndex + 1) + " of " + quiz.length;
}
    const feedback = document.getElementById("feedback");
    if(feedback) feedback.innerText = "";
    
    toggleButtons(false);

    const qText = document.getElementById("question-text");
    if(qText) {
    qText.innerText = q.question;
    document.getElementById("btn0").innerText = q.answers[0];
    document.getElementById("btn1").innerText = q.answers[1];
    document.getElementById("btn2").innerText = q.answers[2];
    document.getElementById("btn3").innerText = q.answers[3];
    }
}

//THIS is the check answer method guys!!
function checkAnswer(selectedIndex) {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    let q = quiz[currentQuestionIndex];
    let feedback = document.getElementById("feedback");

    if (selectedIndex == q.correct) {
    score++;
    document.getElementById("score").innerText = score;
    if(feedback) feedback.innerText = "Correct!";
    } else {
    if(feedback) feedback.innerText = "Wrong!";
    }

    toggleButtons(true);
    setTimeout(() => { nextQuestion(); }, 1500);

    if (selectedIndex == q.correct) {
        score++;
        document.getElementById("score").innerText = score;
        if(feedback) feedback.innerText = "Correct!";
    } else {
        if(feedback) feedback.innerText = "Wrong!";
    }

    toggleButtons(true);
    setTimeout(() => { nextQuestion(); }, 1500);
}


function nextQuestion() {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    currentQuestionIndex++;

    if (currentQuestionIndex < quiz.length) {
    showQuestion();
    } else {
    localStorage.setItem("lastScore", score);
    window.location.href = "Scores.html";
}

    if (currentQuestionIndex < quiz.length) {
        showQuestion();
    } else {
        localStorage.setItem("lastScore", score);
        window.location.href = "Scores.html";
    }
}

function toggleButtons(status) {
    for (let i = 0; i < 4; i++) {
        let btn = document.getElementById("btn" + i);
        if(btn) btn.disabled = status;
    }
}

function displayFinalScore() {
    let finalScore = localStorage.getItem("lastScore") || 0;
    const scoreDisplay = document.getElementById("final-score-display");
    if (scoreDisplay) {
        scoreDisplay.innerText = finalScore;
    }
}

window.onload = function() {
    if (window.location.href.includes("GSQP.html")) {
        startGame();
    } else if (window.location.href.includes("Scores.html")) {
        displayFinalScore();
    }
};


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
