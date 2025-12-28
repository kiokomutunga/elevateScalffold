import User from "../models/user.js";
import otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
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

exports.registerAdmin = async(req, res)=>{
    try{
        const {name, password, email, secretCode } = req.body;

        if (secretCode !== process.env.ADMIN_SECRET){
            return res.status(403).json({message: "Invalid admin Code"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) 
            return res.status(400).json({message: "Admin Already Exists please login with the email"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,email,password:hashedPassword,role:"admin"
        });

        await generateAndSendOtp(email, "verify Your Admin Email");

    res.status(201).json({message: "Admin Created Otp sent to your Email"});



    }catch(err){
        res.status(500).json({error: "Admin Registration Failed "})

    }

};

exports.Login = async() =>{

    try{
        const  {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            //need to know the email whether is the correct
            return res.status(403).json({message: "Invalid email"});
        }
        if (!await bcrypt.compare(password, user.password)){
            return res.status(403).json({message: "invalid password"});
        }
        if (!user.isVerified){
            return res.status(403).json({message: "please Verify your email"})
        }
        
        const token = jwt.sign({id: user._id, role: user.role},process.env.JWT_SECRET);

    }catch(err){

        res.status(500).json({error: "Login failed"});

    }

};

exports.forgotPassword = async (req,res) => {

    try{
        const {email} = req.body;
        const User = await User.findone({email});
        if (!user) return res.status(404).json({message: "User not found"});

        await generateAndSendOtp (email, "Password send OTP");

        res.json({message: "OTP send to your Email"})
    }catch(err){
        res.status(500).json({error: "Password reset failed"});
    }
};

exports.resetPassword = async(req,res)=>{
    try{
        const {email, code, password} = req.body;
        const otp = await Otp.findOne({email, code});

        if (!otp || otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
     }

     const hashedPassword = await bcrypt.hash(newPassword, 10);
     await User.findOneAndUpdate({email}, {password: hashedPassword});
     await Otp.deleteOne({_id: otp._id});

     res.json({message: "password reset successful"});



    }catch(err){
        res.status(500).json({error: "Password reset failed"});
    }
};































