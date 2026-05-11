//This is the to do list
//Question Text: Needs id="question-text"
//Buttons: Needs IDs btn0, btn1, btn2, btn3 and class="StartButton" (to use your purple CSS).
//Feedback: Needs<p id="feedback"></p
//score:Needs<span id="score">0</span

//Go to the bottom of the script: Add }; right after the displayFinalScore(); line and before function shuffle. DONE
//Make the save quiz work and save in database. DONE
//add log in and log out page. DONE
//Go to showQuestion: Delete the duplicate let quiz and let q lines. DONE
// to saveQuestion: Add the other answer IDs to your if check. DONE


function checkLogin() {
    // We normalize the path to lowercase
    const path = window.location.pathname.toLowerCase();
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // We only want to "Protect" the actual game pages.
    // If the URL contains any of these, we check if they are logged in.
    const isGamePage = path.includes("game_scope.html") || 
                       path.includes("gsaq.html") || 
                       path.includes("gsqp.html") || 
                       path.includes("scores.html");

    if (isGamePage && isLoggedIn !== "true") {
        // If they are on a game page but not logged in, send to login (index.html)
        window.location.href = "index.html";
    }
}

// Run the check
checkLogin();

// --- CONFIGURATION ---
const BASE_URL = "https://game-scope-backend.onrender.com"; 

// this is the remove previous questions when closed function guys!
if (!sessionStorage.getItem("sessionStarted")) {
    localStorage.removeItem("quiz");
    sessionStorage.setItem("sessionStarted", "true");
}

let currentQuestionIndex = 0;
let score = 0;
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
    "Shoutout to my girlfriend! I love you <3 Shoutout to the team for pulling this off <3 !!",
    "Your brain can store 2.5 petabytes of data—that is 3 million hours of TV!",
    "Writing by hand helps you remember things better than typing on a laptop.",
    "The brain creates a unique 'map' for every person you know.",
    "Eating dark chocolate can improve blood flow to the brain and boost focus.",
    "Your brain is 73% water—even mild dehydration can affect your attention span.",
    "Reading out loud helps move information from short-term to long-term memory.",
    "The average person has about 6,000 thoughts per day.",
    "Sleep is the only time your brain can 'wash' itself of toxins built up during the day.",
    "Your brain develops until you are in your mid-20s.",
    "Teaching someone else is the most effective way to master a subject.",
    "Taking a nap after learning something new helps your brain 'save' the data.",
    "The human brain can generate about 23 watts of power—enough to light a bulb!",
    "Your brain uses 20% of your body's oxygen despite being only 2% of its weight.",
    "Information travels along your nerves at about 268 miles per hour.",
    "Multitasking is actually impossible; your brain just switches tasks very fast.",
    "Smelling a scent while studying and again during a test can trigger memory.",
    "Blue light from phones keeps your brain awake; use a 'night shift' mode when studying.",
    "The hippocampus (memory center) is larger in people who exercise regularly.",
    "Dreams are your brain's way of processing emotions and events from the day.",
    "A single brain cell can hold up to 1,000 times more data than a computer pixel.",
    "Your brain doesn't have pain receptors—that is why brain surgery can be done while awake!",
    "Learning a second language can slow down brain aging by several years.",
    "The 'Pomodoro Technique' suggests 25 mins of work followed by 5 mins of rest.",
    "Your brain processes images 60,000 times faster than text.",
    "Meditation can physically grow the gray matter in your brain.",
    "Music with no lyrics is usually better for deep focus while reading.",
    "Dopamine is released when you achieve a small goal, like finishing a quiz!",
    "Standing up while studying can increase your heart rate and keep you alert.",
    "Your brain is more creative when you are tired (that is why ideas come at night).",
    "Stretching for 1 minute increases blood flow to your brain instantly.",
    "The brain never 'fills up'; there is infinite room for more learning.",
    "The human eye can see 10 million different colors.",
    "Your brain is the fattiest organ in your body.",
    "Listening to Mozart doesn't make you smarter, but it can improve spatial reasoning.",
    "The best time to study is between 10 AM to 2 PM and 4 PM to 10 PM.",
    "Reviewing notes within 24 hours of learning them increases retention by 80%.",
    "Oxygen is the brain's primary fuel—deep breathing helps you think clearly.",
    "Video games can actually improve hand-eye coordination and brain plasticity.",
    "Socializing and talking to friends is a great way to keep your brain healthy.",
    "Caffeine works by blocking the chemical that tells your brain it is sleepy.",
    "Your brain is as powerful as a supercomputer but runs on the energy of a banana.",
    "Laughter reduces stress hormones and helps the brain relax into 'learning mode'.",
    "The average attention span is about 8 seconds (less than a goldfish!).",
    "Chewing a new flavor of gum while studying helps 'stick' the memory.",
    "Your brain's neurons look a lot like the structure of the entire universe.",
    "Writing a 'To-Do' list at night clears your brain's 'RAM' for better sleep.",
    "Drawing a picture of what you are learning makes you 2x more likely to remember it.",
    "Your brain is most active when you are in REM (deep) sleep.",
    "Curiosity is like a 'hunger' for the brain—it prepares it to absorb info.",
    "You are doing a great job! Keep learning and building cool things!",
];

async function saveQuestion() {
    const qInput = document.getElementById("question");
    const a1 = document.getElementById("a1");
    const a2 = document.getElementById("a2");
    const a3 = document.getElementById("a3");
    const a4 = document.getElementById("a4");
    const cIndex = document.getElementById("correctIndex");
    
    const currentUser = localStorage.getItem("currentUser");

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

    try {
        const response = await fetch(`${BASE_URL}/api/save-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                quizName, 
                questionData,
                username: currentUser 
            })
        });

        if (response.ok) {
            alert("Question saved to your Cloud account!");
            qInput.value = ""; a1.value = ""; a2.value = ""; a3.value = ""; a4.value = "";
        }
    } catch (err) {
        alert("Server is offline. Check if your Render app is running!");
    }
}

//this method checks the quiz for the specific account!!
async function loadQuizList() {
    const listDiv = document.getElementById("quiz-list");
    if (!listDiv) return;

    const currentUser = localStorage.getItem("currentUser");

    try {
        const response = await fetch(`${BASE_URL}/api/quizzes?username=${currentUser}`);
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

async function deleteQuiz(name) {
    if (confirm("Are you sure you want to delete '" + name + "'?")) {
        await fetch(`${BASE_URL}/api/quiz/${name}`, { method: 'DELETE' });
        if (selectedQuizName === name) {
            selectedQuizName = null;
        }
        loadQuizList();
    }
}

//this loads the quiz selected!
function startSelectedQuiz() {
    if (!selectedQuizName) {
        alert("Please select a quiz from the list first!");
        return;
    }
    window.location.href = "GSQP.html";
}

//this starts the game guys!!!
function startGame() {
    score = 0; // Reset score to 0 at the start of a game
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
    if (!quiz[currentQuestionIndex]) return;
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
        score += 5; // Add 5 points
        const scoreElement = document.getElementById("score");
        if(scoreElement) scoreElement.innerText = score;
        if(feedback) feedback.innerText = "Correct! +5 Points";
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
    // Load general data
    if (typeof loadQuizList === "function") loadQuizList();
    if (typeof loadRandomFact === "function") loadRandomFact();

    const path = window.location.pathname.toLowerCase();

    if (path.includes("gsqp.html")) {
        startGame();
    } 
    else if (path.includes("scores.html")) {
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

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    alert("Logged out!");
    window.location.href = "index.html";
}