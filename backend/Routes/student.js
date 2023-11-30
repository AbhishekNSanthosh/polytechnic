const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyStudentToken } = require('../libs/Auth');
const Letter = require('../Models/Letter');
const { fiveHundredResponse, resMessages, fourNotOneResponse, fourNotFourResponse, roles, twoNotOneResponse, twohundredResponse } = require('../Utils/Helpers');
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
            const errorMessage = fourNotOneResponse({message:resMessages.invalidMsg});
            return res.status(401).json(errorMessage);
        }
        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({message:resMessages.invalidMsg});
            return res.status(401).json(errorMessage);
        }
        const user = await User.findOne({ username, role: "student" });
        if (!user) {
            const errorMessage = fourNotFourResponse({message:resMessages.userNotfoundMsg});
            return res.status(404).json(errorMessage);
        }
        if (user.lockUntil > new Date()) {
            const errorMessage = fourNotOneResponse({message:resMessages.AccountLockedMsg});
            return res.status(401).json(errorMessage);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }

            await user.save();
            const errorMessage = fourNotOneResponse({message:resMessages.invalidMsg});
            return res.status(401).json(errorMessage);
        }

        if (user?.role !== "student") {
            const errorMessage = fourNotFourResponse({message:resMessages.userNotfoundMsg});
            return res.status(404).json(errorMessage);
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "student"
        }, "carmelpoly", { expiresIn: '1h' });

        const responseMsg = {
            greetings: `Welcome ${user.username.toUpperCase()} !!!`,
            message: resMessages.AuthSuccessMsg,
            accessType: roles.studentRole,
            accessToken: token,
        }

        const successResponseMsg = twohundredResponse(responseMsg);
        return res.status(200).json(successResponseMsg);

    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to get admin info && token is valid or not
router.get('/getUserDetails', verifyStudentToken, async (req, res) => {
    try {
        if (req.user) {
            const { password, loginAttempts, lockUntil, updatedAt, ...userData } = req.user._doc
            const responseMsg = twohundredResponse({ data: userData, accessToken: req.accessToken });
            return res.status(200).json(responseMsg)
        }
    } catch (error) {
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to create a new letter from student
router.post('/addLetter', verifyStudentToken, async (req, res) => {
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