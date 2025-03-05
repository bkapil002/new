const OTP2 = require('../Model/OTP2')
const emailTemplate2 = require('../templates/emailTemplate2')
const emailServer = require('../Server/emailServer')
const bcrypt = require('bcryptjs');

const otpServer = {
    createOTP: async (email) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const hashedOTP = await bcrypt.hash(otp, 10); // Hash the OTP
        const otpDoc = new OTP2({ email, otp: hashedOTP, attempts:0 });
        await otpDoc.save();
        return { otp, otpId: otpDoc._id };
      },
    
      sendOTPEmail: async (email, otp) => {
        const subject = 'Your OTP Code';
        const html = emailTemplate2(otp); // Use the emailTemplate2 function
        return await emailServer.sendEmail(email, subject, html);
      },
    
      verifyOTP: async (email, otp) => {
        console.log(`Verifying OTP for email: ${email} with OTP: ${otp}`);
        const otpDoc = await OTP2.findOne({ email });
    
        if (!otpDoc) {
          console.log(`OTP not found for email: ${email}`);
          return false;
        }
    
        // Check attempts and increment
        if (otpDoc.attempts >= 3) {
          await OTP2.deleteOne({ _id: otpDoc._id });
          console.log(`Maximum attempts exceeded for email: ${email}`);
          return false;
        }
    
        otpDoc.attempts += 1;
        await otpDoc.save();
    
        // Verify OTP value
        const isValid = await bcrypt.compare(otp, otpDoc.otp);
        if (!isValid) {
          const remainingAttempts = 3 - otpDoc.attempts;
          console.log(`Invalid OTP for email: ${email}. ${remainingAttempts} attempts remaining.`);
          return false;
        }
    
        // OTP is valid, delete the record
        console.log(`OTP verified successfully for email: ${email}`);
        await OTP2.deleteOne({ _id: otpDoc._id });
        return true;
      }
}
module.exports = otpServer;