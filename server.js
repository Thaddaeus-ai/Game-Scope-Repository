// 1. IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 3. DATABASE CONNECTION
// This is the SRV version - much better for Render
const mongoURI = "mongodb+srv://Daeus:GameScope2026@gamescope.audxbez.mongodb.net/QuizData?retryWrites=true&w=majority&appName=GameScope";

// Update the connection code to be cleaner for the cloud:
mongoose.connect(mongoURI)
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.log("❌ CONNECTION FAILED!");
    console.log("Error Message:", err.message);
  });

// 4. SCHEMA
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
app.get('/api/quizzes', async (req, res) => {
    try {
        const allQuizzes = await Quiz.find();
        res.json(allQuizzes);
    } catch (err) { res.status(500).send(err); }
});

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

app.delete('/api/quiz/:name', async (req, res) => {
    try {
        await Quiz.findOneAndDelete({ quizName: req.params.name });
        res.send({ message: "Deleted" });
    } catch (err) { res.status(500).send(err); }
});

// 6. START SERVER (Updated for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));