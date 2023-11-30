const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyTeacherToken } = require('../libs/Auth');
const Letter = require('../Models/Letter');
const { fiveHundredResponse, twoNotOneResponse, twohundredResponse } = require('../Utils/Helpers');
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 attempts
    message: 'Too many login attempts. Your account is locked for 10 minutes.',
});

//api to login student
router.post('/teacherLogin', limiter, async (req, res) => {
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

        if (user?.role !== "teacher") {
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
            username: user.username, userId: user._id, role: "teacher"
        }, "carmelpoly", { expiresIn: '1h' });

        const responseMsg = {
            greetings: `Welcome ${user.username.toUpperCase()} !!!`,
            message: errorMessages.AuthSuccessMsg,
            accessType: roles.studentRole,
            accessToken: token,
        }

        const successResponseMsg = twohundredResponse(responseMsg);
        return res.status(200).json(successResponseMsg);

    } catch (err) {
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to add letter by teacher
router.post('/addLetter', verifyTeacherToken, async (req, res) => {
    const { body, subject } = req.body;

    try {
        const newLetter = new Letter({
            body,
            from: req.userId,
            subject,
            sender: req?.user?.role
        });

        const savedLetter = await newLetter.save();
        const responseMsg = {
            resCode: 201,
            status: 'SUCCESS',
            message: 'created successfully.',
            data: savedLetter,
            accessToken: req.accessToken
        }
        const successResponseMsg = twoNotOneResponse(responseMsg);
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

module.exports = router;