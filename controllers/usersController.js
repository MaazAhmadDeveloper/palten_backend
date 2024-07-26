import Users from "../models/usersModel.js";
import mongoose from "mongoose";
import UsersContact from "../models/userContact.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
const saltRounds = 10;

function generateOTP() {
  return (Math.floor(Math.random() * 900000) + 100000).toString();
};

// Function to send verification email
async function sendVerificationEmail(user, otp) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other email services
      auth: {
        user: 'zaccyname1125@gmail.com',
        pass: 'ffhd navp dnxa qgek',
      },
    });

    const mailOptions = {
      from: 'File Conversion Tool',
      to: user.email,
      subject: 'Email Verification for File Conversion Tool',
      html: `
      <div style="text-align: center;">
        <h1>Hi ${user.userName}, Please verify your email</h1>
        <p>This is your OTP Code:</p>
        <p style="font-size: 24px;">${otp}</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};


//for add or fetch
export const addUsersController = async (req, res) => {
    
    const {userName, email, password } = req.body;
    const otp = generateOTP();

    try {
      const user = await Users.findOne({ email: email });
      if (!user) {

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            try {
                const newUser = new Users({
                    userName,
                    email,
                    password: hash,
                    credits: 0,
                    verificationOTP: otp,
                    isVerified: false,
                  });
    
                  //  console.log(newUser);
    
                  await newUser.save();
                  // console.log("db saved");
    
                  await sendVerificationEmail(newUser, otp);
                  res.status(200).send('Sign Up successful. Please check your email to verify your account.');
    
            } catch(error) {
                console.log(error);
                res.status(400).send('Sign Up Failed. Please try again ', error);
            }
        });
      }else{
        res.status(405).send({message: 'Sign Up Failed. Because user already exist', user: "exist"});
      }
    } catch (error) {
      res.status(405).send('Sign Up Failed. Because already exist ');
    }

    
    
}


// Route to handle email verification
export const otpVerifyController = async (req, res) => {
    const { otpValue, userMail } = req.body;
    // console.log(otpValue + " from user");

    try {
      const user = await Users.findOneAndUpdate(
        { verificationOTP: otpValue, email: userMail },
        { $set: { isVerified: true, credits: 10 }, $unset: { verificationOTP: "" } },
        { new: true }
      );
      // console.log(user + " from DB");
      if (!user) {
        return res.status(400).send('Invalid or expired OTP.');
      }
      console.log("userController " +user);

      res.status(200).send({
        message: 'Email verified successfully.',
        email: user.email,
      });
      
    } catch (error) {
      return res.status(400).send('Invalid or expired OTP.');
    }
    
  };
  
  
  
  
  export const getUserController = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Users.findOne({ email: email });
  
      if (user) {
        if (user.isVerified === true) {
          bcrypt.compare(password, user.password, function(err, result) {
            if (result === true) {
              res.status(200).send({
                message: 'User found successfully.',
                email: user.email,
              });  
            } else {
              res.status(401).send({message: 'Incorrect password.' });
            }
          });
        } else {
          await sendVerificationEmail(user, user.verificationOTP);
          res.status(403).send({message: 'User not verified.' });
        }
      } else {
        res.status(404).send({message: 'User not found.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Internal server error.',
        error: error.message,
      });
    }
  };
  
  
  
export const addContactUsController = async (req, res) => {
    const { userName, email, zip, city, address, message } = req.body;

    const userContactObj = new UsersContact({
      userName,
      email,
      zip,
      city,
      address,
      message
    })

    try {
      await userContactObj.save();
      res.status(200).send({message: "user contact with message saved successfully"})
    } catch (error) {
      res.status(400).send({message: "Error while userContact data saved in DB", error});
      console.log("Error while userContact data saved in DB", error);
    }

  };
  

