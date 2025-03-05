const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../Model/User');
const {generateToken} = require('../ultils/tokenUtils')
const cookiConfig =require('../ultils/cookieConfig')
const otpServer = require('../Server/otpServer')
const otpServer2 = require('../Server/otpServer2');
const { body } = require('framer-motion/client');
const router = express.Router();


router.post('/email',async(req ,res)=>{
    try {
        const { email } = req.body;
    
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already registered' });
        }
    
        // Generate OTP and send email
        const { otp, otpId } = await otpServer.createOTP(email);
        const emailSent = await otpServer.sendOTPEmail(email, otp);
    
        if (!emailSent) {
          return res.status(500).json({ error: 'Failed to send OTP email' });
        }
    
        res.json({
          message: 'OTP sent successfully',
          email
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})




router.post('/emailVerify/:email' , async(req,res)=>{
  try{
    const { email } = req.params;
    const { otp } = req.body;

    console.log(`Received OTP verification request for email:${email} with OTP:${otp}`)

    const isValid = await otpServer.verifyOTP(email, otp);
    if(!isValid){
      return res.status(400).json({message: 'Invalid OTP'});
    }

    res.json({message: 'OTP verified successfully' ,email});
  }catch(error){
    res.status(500).json({error: error.message});
  }
})




router.post('/register/:email', async(req,res)=>{
      try{
        const{email}=req.params;
        const { password } = req.body;
        if(!email || !password ){
          return res.status(400).json({message: 'Email, password, and name are required'});
        }
        if(password.length < 5){
          return res.status(400).json({message: 'Password must be at least 5 characters long'});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
          return res.status(400).json({message: 'Email already registered'});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({email,password:hashedPassword});
        
        const token = generateToken(user._id);

        res.cookie('token',token,cookiConfig)
        .status(201)

        .json({
          token,
          user:{
            _id:user._id,
            email:user.email
          }
        })
      }catch(error){
        res.status(500).json({error: error.message});
      }
})





router.post('/login', async(req,res)=>{
    try{
       const {email , password}= req.body;
       const user = await User.findOne({email});

       if(!user){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const ismatch = await bcrypt.compare(password , user.password);
       if(!ismatch){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const token = generateToken(user._id);

       res.cookie('token',token,cookiConfig)
       .json({
        token,
        user:{
          _id:user._id,
          name:user.name,
          email:user.email
        }
       })
    }catch(error){
      res.status(500).json({error: error.message});
    }
})




router.post('/logOut',(req,res)=>{
  res.clearCookie('token',{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({message:'logged out successfully'})
 
})



router.post('/forgotPassword',async(req,res)=>{
  try{
     const {email} = req.body;
     const user = await User.findOne({email});
     if(!user){
       return res.status(400).json({message: 'Email not found'});
     }

     const {otp , otpId} = await otpServer2.createOTP(user._id , email);
     const emailSent = await otpServer2.sendOTPEmail(email, otp);
     if(!emailSent){
       return res.status(500).json({error: 'Failed to send OTP email'});
     }

     res.json({message: 'OTP sent successfully', otpId});
  }catch(error){
    res.status(500).json({error: error.message});
  }
})


router.post('/verify-Otp/:otpId',async(req ,res)=>{
  try{
     const {otpId} =req.params;
     const {otp} = req.body;

     if(!otp){
       return res.status(400).json({message: 'OTP is required'});
     }

     const {userId }= await otpServer2.verifyOTP(otpId, otp);

     res.json({message: 'OTP verified successfully',userId});
  }catch(error){
    res.status(500).json({error: error.message});
  }
})



router.post('/resetPassword/:userId',async(req,res)=>{
  try{
    const{userId} = req.params
    const{newPassword} = req.body;

    if(!newPassword || newPassword.length < 5){
      return res.status(400).json({message: 'Password must be at least 5 characters long'});
    }

    const user = await User.findOne({_id: userId});
    if(!user){
      return res.status(400).json({message: 'User not found'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({message: 'Password reset successfully'});
  }catch(error){
    res.status(500).json({error: error.message});
  }
})

module.exports = router;