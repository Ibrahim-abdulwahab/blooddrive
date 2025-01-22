const nodemailer = require("nodemailer");
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services or custom SMTP settings
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email address
    pass: process.env.EMAIL_PASS,   // Replace with your email password (or app-specific password)
  },
});

// Create a function to send the email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // The sender's email
    to: to,                        // Recipient email
    subject: subject,              // Email subject
    text: text,                    // Email body
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };