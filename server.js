//data base is finally working YESS YESS YESS

// 1. IMPORTS (Must be at the very top)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. INITIALIZE APP
const app = express();
app.use(cors());
app.use(express.json());

// 3. DATABASE CONNECTION
// Using the SRV version which worked for your Render build
const mongoURI = "mongodb+srv://Daeus:GameScope2026@gamescope.audxbez.mongodb.net/QuizData?retryWrites=true&w=majority&appName=GameScope";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.log("❌ CONNECTION FAILED!");
    console.log("Error Message:", err.message);
  });

// 4. SCHEMA (Defining the data structure)
const quizSchema = new mongoose.Schema({
    quizName: String,
    questions: [{
        question: String,
        answers: [String],
        correct: Number
    }]
});
const Quiz = mongoose.model('Quiz', quizSchema);

// 5. ROUTES
// Home Route (to prevent "Cannot GET /" error)
app.get('/', (req, res) => {
    res.send("🚀 Game Scope Server is Online!");
});

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const allQuizzes = await Quiz.find();
        res.json(allQuizzes);
    } catch (err) { res.status(500).send(err); }
});

// Save a question
app.post('/api/save-question', async (req, res) => {
    const { quizName, questionData } = req.body;
    try {
        let quiz = await Quiz.findOne({ quizName });
        if (!quiz) {
            quiz = new Quiz({ quizName, questions: [questionData] });
        } else {
            quiz.questions.push(questionData);
        }
        await quiz.save();
        res.status(200).send({ message: "Saved!" });
    } catch (err) { res.status(500).send(err); }
});

// Delete a quiz
app.delete('/api/quiz/:name', async (req, res) => {
    try {
        await Quiz.findOneAndDelete({ quizName: req.params.name });
        res.send({ message: "Deleted" });
    } catch (err) { res.status(500).send(err); }
});

// 6. START SERVER (Only at the very bottom)
const PORT = process.env.PORT || 10000; 
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});