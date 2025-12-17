import User from "../models/user.js";
import otp from "../models/Otp.js";
import bcrypt from "bcryptjs";

const generateotp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//scale a number with six digit 

//signing for the first time 

export const signup = (req,res) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create(
      {
        name,
        email,
        password: hashedPassword,
        authProvider: "local",
        isVerified: false
      }
    );

    await otp.deleteMany ({email, purpose: "verify"});

    const otpcode = generateOtp();

    await otp.create({
      email,
      code: otpcode,
      purpose: "verify",
      expiresAt: new Date(Date.now() + 10* 60 * 1000)

    });

    //send email via email

    return res.status(201).json ({
      message: "Account created . Verify email sent to your emial"
    });


  }
  catch(error){
    console.error(error);
    res.status(500).json({
      message: "Account creation Failed"
    })
  }
};
