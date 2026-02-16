const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, organizationId } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name,
            email,
            password,
            role,
            organizationId,
            verificationToken,
            isVerified: false // Explicitly set to false
        });

        await user.save();

        // Send Verification Email
        // Default to localhost if client url not set, for safety
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your TextileTrace Account',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #d4af37;">Welcome to TextileTrace!</h1>
                    <p>Thank you for joining the secure supply chain network.</p>
                    <p>Please click the link below to verify your email address and activate your node:</p>
                    <a href="${verificationUrl}" style="background-color: #d4af37; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    <p style="margin-top: 20px;">Or copy this link: ${verificationUrl}</p>
                    <p>This link is valid for 24 hours.</p>
                </div>
            `
        };

        try {
             // Only attempt to send if credentials are roughly present, else warn log
             if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await transporter.sendMail(mailOptions);
                res.json({ msg: 'Registration successful! Please check your email to verify your account.' });
             } else {
                console.warn('Email credentials missing. User registered but email NOT sent.');
                res.status(201).json({ msg: 'User registered. WARNING: Email credentials missing in backend, verification email not sent.', warning: true });
             }
        } catch (emailError) {
            console.error('Email send error:', emailError);
            res.status(500).json({ msg: 'User registered but email failed to send.', error: emailError.message });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear token
        await user.save();

        res.json({ msg: 'Email verified successfully! You can now login.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Resend Verification Email
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ msg: 'Email already verified' });
        }

        // Reuse existing token
        const verificationToken = user.verificationToken;
        if (!verificationToken) {
             // Should not happen if unverified, but safeguard
             return res.status(500).json({ msg: 'Error: No verification token found. Please register again.' });
        }

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your TextileTrace Account (Resend)',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #d4af37;">Welcome to TextileTrace!</h1>
                    <p>You requested a new verification link.</p>
                    <p>Please click the link below to verify your email address and activate your node:</p>
                    <a href="${verificationUrl}" style="background-color: #d4af37; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    <p style="margin-top: 20px;">Or copy this link: ${verificationUrl}</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            res.json({ msg: 'Verification email resent! Please check your inbox.' });
        } else {
             res.status(500).json({ msg: 'Server Email Credentials Missing. Cannot resend.' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check verification status
        if (!user.isVerified) {
             return res.status(401).json({ msg: 'Please verify your email address before logging in.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                organizationId: user.organizationId
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
