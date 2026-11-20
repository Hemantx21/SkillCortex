import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, captchaId, captchaAnswer } = req.body;
        if (captchaId && !verifyCaptcha(captchaId, captchaAnswer)) {
            return res.status(400).json({ message: 'Captcha verification failed' });
        }
        if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
        if (!emailOk) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }
        if (role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts cannot be self-registered' });
        }
        const userRole = role || 'candidate';
        if (!['candidate', 'hr'].includes(userRole)) {
            return res.status(400).json({ message: 'Please select a valid account type' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        let normalizedPhone;
        if (phone) {
            normalizedPhone = String(phone).replace(/[\s-]/g, '');
            if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
                return res.status(400).json({ message: 'Please enter a valid phone number' });
            }
        }

        const existingUser = await User.findOne({ email: normalizedEmail }).collation({ locale: 'en', strength: 2 });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: userRole,
            isApproved: true,
            ...(normalizedPhone ? { phone: normalizedPhone } : {})
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error && error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field';
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered` });
        }
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check the normalized value first, then support legacy mixed-case emails.
        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = await User.findOne({ email: normalizedEmail }).collation({ locale: 'en', strength: 2 });
        }
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Verify token route (useful for AuthContext on frontend)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
// Simple in-memory captcha store
const captchas = new Map();
function makeCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const id = Math.random().toString(36).slice(2);
    captchas.set(id, { answer: String(a + b), expires: Date.now() + 5 * 60 * 1000 });
    return { id, question: `What is ${a} + ${b}?` };
}

router.get('/captcha', (req, res) => {
    const c = makeCaptcha();
    res.json(c);
});

function verifyCaptcha(id, answer) {
    const c = captchas.get(id);
    if (!c) return false;
    if (c.expires < Date.now()) { captchas.delete(id); return false; }
    const ok = c.answer === String(answer).trim();
    captchas.delete(id);
    return ok;
}


// Forgot password - request OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, phone, captchaId, captchaAnswer } = req.body;
        if (captchaId && !verifyCaptcha(captchaId, captchaAnswer)) {
            return res.status(400).json({ message: 'Captcha verification failed' });
        }
        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or phone is required' });
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }
        if (phone && !/^\+?[0-9]{7,15}$/.test(String(phone).replace(/[\s-]/g, ''))) {
            return res.status(400).json({ message: 'Please enter a valid phone number' });
        }
        const user = await User.findOne(email ? { email } : { phone });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email/phone' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save();

        // In production, send via SMS/email provider. For dev, return OTP.
        res.json({ message: 'OTP sent.', devOtp: process.env.NODE_ENV === 'production' ? undefined : otp });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        if (!otp) return res.status(400).json({ message: 'OTP is required' });

        const user = await User.findOne(email ? { email } : { phone });
        if (!user || !user.otpCode || user.otpCode !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const resetToken = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'OTP verified.', resetToken });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Reset token and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ resetPasswordToken: resetToken });
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google OAuth code exchange
router.post('/google', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Missing code' });
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback';
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) return res.status(400).json({ message: 'Google token exchange failed', detail: tokenData });
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
        const profile = await userRes.json();
        const email = profile.email;
        if (!email) return res.status(400).json({ message: 'No email from Google' });
        let user = await mongoose.connection.db.collection('users').findOne({ email });
        if (!user) {
            const doc = { name: profile.name || email, email, password: '', role: 'candidate', createdAt: new Date(), updatedAt: new Date(), provider: 'google' };
            const r = await mongoose.connection.db.collection('users').insertOne(doc);
            user = { _id: r.insertedId, ...doc };
        }
        const token = jwt.sign({ userId: user._id, role: user.role || 'candidate' }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role || 'candidate' } });
    } catch (e) {
        console.error('Google OAuth error', e);
        res.status(500).json({ message: 'Google OAuth failed', error: e.message });
    }
});

// GitHub OAuth code exchange
router.post('/github', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Missing code' });
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/callback';
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) return res.status(400).json({ message: 'GitHub token exchange failed', detail: tokenData });
        const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'SkillCortex' } });
        const profile = await userRes.json();
        let email = profile.email;
        if (!email) {
            const emailsRes = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'SkillCortex' } });
            const emails = await emailsRes.json();
            const primary = (emails || []).find((e) => e.primary) || (emails || [])[0];
            email = primary?.email;
        }
        if (!email) return res.status(400).json({ message: 'No email from GitHub' });
        let user = await mongoose.connection.db.collection('users').findOne({ email });
        if (!user) {
            const doc = { name: profile.name || profile.login || email, email, password: '', role: 'candidate', createdAt: new Date(), updatedAt: new Date(), provider: 'github' };
            const r = await mongoose.connection.db.collection('users').insertOne(doc);
            user = { _id: r.insertedId, ...doc };
        }
        const token = jwt.sign({ userId: user._id, role: user.role || 'candidate' }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role || 'candidate' } });
    } catch (e) {
        console.error('GitHub OAuth error', e);
        res.status(500).json({ message: 'GitHub OAuth failed', error: e.message });
    }
});

export default router;
