// 1. IMPORTS
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. INITIALIZE APP
const app = express();
app.use(cors());
app.use(express.json());

// 3. DATABASE CONNECTION
// Using your SRV string
const mongoURI = "mongodb+srv://Daeus:GameScope2026@gamescope.audxbez.mongodb.net/QuizData?retryWrites=true&w=majority&appName=GameScope";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.log("❌ CONNECTION FAILED!");
    console.log("Error Message:", err.message);
  });

// 4. SCHEMAS
const quizSchema = new mongoose.Schema({
    username: String, 
    quizName: String,
    questions: [{
        question: String,
        answers: [String],
        correct: Number
    }]
});
const Quiz = mongoose.model('Quiz', quizSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 5. ROUTES

// Home Route
app.get('/', (req, res) => {
    res.send("🚀 Game Scope Server is Online!");
});

// Get all quizzes for a SPECIFIC user
app.get('/api/quizzes', async (req, res) => {
    try {
        const { username } = req.query; 
        const allQuizzes = await Quiz.find({ username: username });
        res.json(allQuizzes);
    } catch (err) { res.status(500).send(err); }
});

// Save a question
app.post('/api/save-question', async (req, res) => {
    const { quizName, questionData, username } = req.body;
    try {
        let quiz = await Quiz.findOne({ quizName, username });
        if (!quiz) {
            quiz = new Quiz({ quizName, username, questions: [questionData] });
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

// Register Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: "User created!" });
    } catch (err) {
        res.status(400).send({ error: "Username already taken" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ error: "Wrong password" });

        res.send({ message: "Success", username: user.username });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 6. START SERVER (Always at the bottom)
// Changed to listen on 0.0.0.0 for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});