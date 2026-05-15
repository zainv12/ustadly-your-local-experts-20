const nodemailer = require('nodemailer');

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `Ustaadly <${process.env.EMAIL}>`,
    to: to,
    subject: 'Your Ustaadly Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Ustaadly</h2>
        <h3 style="color: #333;">Verify Your Email</h3>
        <p>Thank you for registering! Use the code below to verify your account:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 10px;">${otp}</h1>
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't register on Ustaadly, ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;