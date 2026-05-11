//This is the to do list
        //Question Text: Needs id="question-text"
        //Buttons: Needs IDs btn0, btn1, btn2, btn3 and class="StartButton" (to use your purple CSS).
        //Feedback: Needs<p id="feedback"></p
        //score:Needs<span id="score">0</span

        //Go to the bottom of the script: Add }; right after the displayFinalScore(); line and before function shuffle. DONE
        //Make the save quiz work and save in database.
        //add log in and log out page.
        //Go to showQuestion: Delete the duplicate let quiz and let q lines. DONE
        // to saveQuestion: Add the other answer IDs to your if check. DONE

// --- CONFIGURATION ---
// This tells the browser where to find your Render engine
const BASE_URL = "https://game-scope-backend.onrender.com"; 

// this is the remove previous questions when closed function guys!
if (!sessionStorage.getItem("sessionStarted")) {
    localStorage.removeItem("quiz");
    sessionStorage.setItem("sessionStarted", "true");
}

let currentQuestionIndex = 0;
let score = 0;
// Tracker for which quiz is selected lol
let selectedQuizName = null;

const funFacts = [
    "Testing yourself is 3x more effective than just re-reading your notes!",
    "Your brain uses about 20% of your body's total energy.",
    "Taking a 10-minute break every hour helps you memorize things faster.",
    "Explaining a topic to someone else (or your pet) is the best way to learn it!",
    "Sleeping after studying helps 'cement' the information into your long-term memory.",
    "The 'Spacing Effect' means studying 15 mins a day is better than 3 hours once a week.",
    "Cursive writing helps the brain process information more deeply than typing.",
    "Listening to Lo-Fi or Baroque music (60bpm) helps the brain enter a 'flow' state.",
    "Drinking water while studying can improve your brain performance by 14%!",
    "Your brain can process an image in just 13 milliseconds.",
    "Laughing while learning helps you remember information for a longer time.",
    "Taking a walk in nature can boost your creative thinking by up to 60%.",
    "Short-term memory can usually only hold about 7 items at a time.",
    "Smelling peppermint or rosemary while studying can help you focus better.",
    "Being curious actually makes your brain better at learning 'boring' information!",
    "Your brain is more active at night than during the day!",
    "Chewing gum while studying might help you stay alert and improve memory.",
    "Shoutout to my girlfriend! I love you <3 Shoutout to the team for pulling this off <3 !!"
];

// This is the save questions system guys!! (UPDATED FOR MONGODB)
async function saveQuestion() {
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

    let quizName = prompt("Which Quiz should this go into? (e.g. Quiz 1)", "Quiz 1");
    if (!quizName) return;

    let questionData = {
        question: qInput.value,
        answers: [a1.value, a2.value, a3.value, a4.value],
        correct: parseInt(cIndex.value) 
    };

    // SEND TO BACKEND
    try {
        const response = await fetch(`${BASE_URL}/api/save-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizName, questionData })
        });

        if (response.ok) {
            alert("Question saved to Cloud MongoDB!");
            qInput.value = ""; a1.value = ""; a2.value = ""; a3.value = ""; a4.value = "";
        }
    } catch (err) {
        alert("Server is offline. Check if your Render app is running!");
    }
}

// this is for showing all the quizzes in the box (UPDATED FOR MONGODB)
async function loadQuizList() {
    const listDiv = document.getElementById("quiz-list");
    if (!listDiv) return;

    try {
        const response = await fetch(`${BASE_URL}/api/quizzes`);
        const allQuizzes = await response.json();
        
        listDiv.innerHTML = "";

        allQuizzes.forEach(quiz => {
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.gap = "10px";
            container.style.alignItems = "center";

            const btn = document.createElement("button");
            btn.className = "quiz-item";
            btn.style.flexGrow = "1";
            btn.innerText = quiz.quizName;
            btn.onclick = function() {
                document.querySelectorAll('.quiz-item').forEach(b => b.classList.remove('selected-quiz'));
                btn.classList.add('selected-quiz');
                localStorage.setItem("quiz", JSON.stringify(quiz.questions));
                selectedQuizName = quiz.quizName;
            };

            const delBtn = document.createElement("button");
            delBtn.innerText = "X";
            delBtn.className = "delete-quiz-btn";
            delBtn.onclick = function(e) {
                e.stopPropagation(); 
                deleteQuiz(quiz.quizName);
            };

            container.appendChild(btn);
            container.appendChild(delBtn);
            listDiv.appendChild(container);
        });
    } catch (err) {
        console.log("Could not load quizzes from server.");
    }
}

// Function to delete a quiz (UPDATED FOR MONGODB)
async function deleteQuiz(name) {
    if (confirm("Are you sure you want to delete '" + name + "'?")) {
        await fetch(`${BASE_URL}/api/quiz/${name}`, { method: 'DELETE' });
        if (selectedQuizName === name) {
            selectedQuizName = null;
        }
        loadQuizList();
    }
}

function startSelectedQuiz() {
    if (!selectedQuizName) {
        alert("Please select a quiz from the list first!");
        return;
    }
    window.location.href = "GSQP.html";
}

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

function showQuestion() {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    let q = quiz[currentQuestionIndex];

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

function checkAnswer(selectedIndex) {
    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
    let q = quiz[currentQuestionIndex];
    let feedback = document.getElementById("feedback");

    if (selectedIndex == q.correct) {
        score++;
        const scoreElement = document.getElementById("score");
        if(scoreElement) scoreElement.innerText = score;
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

function loadRandomFact() {
    const factElement = document.getElementById("fact-text");
    if (factElement) {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        factElement.innerText = funFacts[randomIndex];
    }
}

window.onload = function() {
    loadQuizList();
    loadRandomFact();

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