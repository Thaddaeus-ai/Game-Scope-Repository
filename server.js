// 1. IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 3. DATABASE CONNECTION
const mongoURI = "mongodb://Daeus:GameScope2026@gamescope-shard-00-00.audxbez.mongodb.net:27017,gamescope-shard-00-01.audxbez.mongodb.net:27017,gamescope-shard-00-02.audxbez.mongodb.net:27017/QuizData?ssl=true&replicaSet=atlas-m9v8p1-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000
})
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.log("❌ Connection Error:", err.message));

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