import User from "../models/user.js";
import otp from "../models/Otp.js";
import bcrypt from "bcryptjs";

const generateotp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//scale a number with six digit 

//signing for the first time 

export const signup = () => {
  try{

    const {name , email, password, adminCode } = req.body;
    //destract to variables to work o them

    if (adminCode !== process.env.ADMIN_ACCESS_CODE) {
      return res.status(403).json({
        message: "Ivalid Admin code Access Denied"
      });
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({
        message: "User already exists please loggin to continue"
      });
    }

  }
}
