// sendEmail.js

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail (you can configure it for other email services)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can change this to another email provider (e.g., 'outlook', 'yahoo')
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or App Password if 2FA is enabled
    },
});

// Function to send email verification link
const sendVerificationEmail = (userEmail, token) => {
    const verificationLink = `http://luminangltest.onrender.com/verify-email/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Email Verification - Confirm Your Account',
        text: `Please click the link below to verify your email address and activate your account:\n\n ${verificationLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};

// Function to send password reset email
const sendPasswordResetEmail = (userEmail, resetToken) => {
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Password Reset Request',
        text: `Click the link below to reset your password:\n\n ${resetLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending password reset email:', error);
        } else {
            console.log('Password reset email sent:', info.response);
        }
    });
};

// Export functions
module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
};
