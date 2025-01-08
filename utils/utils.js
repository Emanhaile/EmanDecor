const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a reset token
exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Generates a random 64-character hex token
};

// Send a password reset email
exports.sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use another email service like SendGrid or SES
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You can reset your password by clicking on the following link: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};
