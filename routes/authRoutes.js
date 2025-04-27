const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Send Verification Email
const sendVerificationEmail = async (user, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking <a href="http://luminangltest.onrender.com/auth/verify/${token}">here</a></p>`
    };

    await transporter.sendMail(mailOptions);
};

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    const token = crypto.randomBytes(16).toString('hex');
    user.verificationToken = token;

    try {
        await user.save();
        await sendVerificationEmail(user, token);
        res.status(200).json({ message: 'Please check your email to verify your account.' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user.' });
    }
});

// Verify User
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();
    res.status(200).json({ message: 'Account verified successfully!' });
});

module.exports = router;
