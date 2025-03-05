const OTP = require('../Model/OTP');
const emailService = require('./emailServer');
const { generateOTPTemplate } = require('../templates/emailTemplates');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class OTPService {



  // Generate a 6-digit OTP
  generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create an OTP for a user
  async createOTP(userId, email) {
    
    await OTP.deleteMany({ userId });

    const otp = this.generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); 

    
    const otpRecord = await OTP.create({
      otpId: new mongoose.Types.ObjectId(),
      userId,
      email,
      otp: hashedOTP,
      attempts: 0, 
    });

    return { otp, otpId: otpRecord.otpId };
  }




   async verifyOTP(otpId, otp) {
    const otpRecord = await OTP.findOne({ otpId });

    if (!otpRecord) {
      throw new Error('OTP not found or expired');
    }

   
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ otpId });
      throw new Error('Maximum attempts exceeded. Please request a new OTP.');
    }

    otpRecord.attempts += 1;
    await otpRecord.save();

    
    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      const remainingAttempts = 3 - otpRecord.attempts;
      throw new Error(`Invalid OTP. ${remainingAttempts} attempts remaining.`);
    }


    const { userId } = otpRecord;
    await OTP.deleteOne({ otpId });

    return { userId };
  }








  async sendOTPEmail(email, otp) {
    const template = generateOTPTemplate(otp);
    return await emailService.sendEmail(
      email,
      'Password Reset Request',
      template
    );
  }
}

module.exports = new OTPService();