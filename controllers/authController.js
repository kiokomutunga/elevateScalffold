import User from "../models/user.js";
import otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

const generateAndSendOtp = async (email, subject) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
        {email},
        {code:otpCode, expiresAt: Date.now() + 10*60*1000},
        {upsert: true}
    );
    

    return otpCode;
};

//generate the otp and assign the time until it expires

//new user registering
exports.register = async (req,res) => {
    try{
        const {name, email, password} = req.body;
        //check if the  user exists in the database via the email
        const existingUser = await User.findOne({email});

        if (existingUser) 
            return res.status(400).json({message: "user Already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            {   name,
                email, 
                password: hashedPassword          
            }
        );

        await generateAndSendOtp(email, "verify your email");

        res.status(201).json({message: "One Time Password has been send to email"});

    }catch(err){
        res.status(500).json({error: "Registration failed"});

    }

};


