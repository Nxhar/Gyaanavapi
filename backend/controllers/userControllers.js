const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const generateToken =  require("../config/generateToken")
const router = express.Router();

const registerUser = expressAsyncHandler(async (req,res)=>{
    const {name,email,password,number} = req.body;

    if(!name || !email || !password || !number){
        res.status(400);
        throw new Error("Please enter all fields");

    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("user already exits");
    }


    const user = await User.create({
        name,
        email,
        password,
        number,
    })
    if(user){
        // res.status(201).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     number: user.number,
        //     token: generateToken(user._id),

        // })
        
        res.redirect('/login')
    }
    else{
        res.status(400);
        throw new Error("user not found")
    }
});

const cookie = require('cookie');

const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Set the global variable to the current user's ID
        currentUser = user._id;  // Update currentUser to the logged-in user's ID
        
        // Set a cookie with the user's ID
        res.setHeader('Set-Cookie', cookie.serialize('userId', user._id.toString(), {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 60 * 60 * 24 * 7, // Expires in 1 week
            path: '/' // Available for all routes
        }));

        // Send user info back
        res.redirect('/quizpage')
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});




// const authUser = expressAsyncHandler(async(req,res)=>{
//     const {email,password} = req.body;
// //    console.log(email);
// //    console.log(password);
//     const user = await User.findOne({email});

//     if(user && (await user.matchPassword(password)))
//     {
//         // res.json({
//         //     _id: user._id,
//         //     name: user.name,
//         //     email: user.email,
//         //     number: user.number,
//         //     token: generateToken(user._id),
//         // }
//         res.redirect('/quizpage')
    
//     }
//     else{
//         res.status(401);
//         throw new Error("invalid email or password");
//     }

// })


router.route('/signup').post(registerUser);
router.route('/login').post(authUser);

module.exports= {registerUser, authUser}
