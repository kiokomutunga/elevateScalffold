import User from "../models/user.js";
import otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

const generateAndSendOtp = async () => {
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

