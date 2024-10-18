
const express = require("express");
const app = express();
const path = require('path');
const dotenv = require("dotenv")
dotenv.config();
const PORT = process.env.PORT || 7000;
const cors = require('cors');
const connectDB = require("./config/db")
app.use(cors());
app.use(express.json());
const userRouter = require("./routes/userRoutes")
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/Authentication')));
const bodyParser = require('body-parser');
const User = require("./models/userModel")
connectDB();


let currentUser = null;  // Global variable to hold the logged-in user ID

//api's -------


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
})

app.get("/login", (req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/Authentication/login.html'));
})

app.get("/signup", (req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/Authentication/signup.html'));
})

app.use("/api/user", userRouter);

// app.get("/quizpage", (req,res)=>{
//     res.send("quizpage");
// })

app.get("/results", (req,res)=>{
    res.send("results");
})

app.get("/quizpage", (req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/quiz.html'));
})
app.get("/mcqpage", (req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/mcqpage.html'));
})


app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    
  
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Set the global variable to the current user's ID
    currentUser = user._id;


   
  
    res.json({ success: true, message: "Logged in successfully", user });
  });




app.post("/submitQuizResults", (req, res) => {
    const { score, totalQuestions } = req.body;
    console.log(req.body)
    // Assuming you have user data stored in req.user (from session or JWT)
    const userId = req.user ? req.user.id : null;  // Replace with actual user session logic
  
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    // Example with MongoDB (using Mongoose)
    const QuizResult = require('./models/quizResult'); // Your quiz result schema
  
    const quizData = new QuizResult({
      userId: userId,
      score: score,
      totalQuestions: totalQuestions,
      timestamp: new Date(),
    });
  
    quizData.save()
      .then(result => {
        res.json({ success: true, message: "Results saved successfully", result });
      })
      .catch(error => {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      });
  });


app.listen(PORT, (req,res)=>{
    console.log("server is running");
})