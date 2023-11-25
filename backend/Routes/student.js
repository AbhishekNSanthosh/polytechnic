const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 attempts
    message: 'Too many login attempts. Your account is locked for 10 minutes.',
});

//api to login student
router.post('/studentLogin', limiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            return res.status(401).json({
                resCode: 401,
                status: 'FAILURE',
                message: 'Invalid username or password'
            });
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            return res.status(401).json({
                resCode: 401,
                status: 'FAILURE',
                message: 'Invalid username or password'
            });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                resCode: 401,
                status: 'FAILURE',
                message: 'Authentication failed. User not found.'
            });
        }
        if (user.lockUntil > new Date()) {
            return res.status(401).json({
                resCode: 401,
                status: 'FAILURE',
                message: 'Account is locked. Try again later.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            user.loginAttempts += 1;

            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }

            await user.save();
            console.log(user)
            return res.status(401).json({
                resCode: 401,
                status: 'FAILURE',
                message: 'Invalid username or password'
            });
        }

        if (user?.role !== "student") {
            return res.status(404).json({
                resCode: 404,
                status: "FAILURE",
                message: "User not found"
            });
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "student"
        }, "carmelpoly", { expiresIn: '1h' });

        return res.status(200).json({
            resCode: 200,
            status: 'SUCCESS',
            greetings: `Welcome ${user.username.toUpperCase()} !!!`,
            accessToken: token,
            message: 'Authentication successfull',
        });

    } catch (err) {
        return res.status(500).json({
            resCode: 500,
            status: "FAILURE",
            message: "Internal server error. Please try again later."
        });
    }
});

module.exports = router;