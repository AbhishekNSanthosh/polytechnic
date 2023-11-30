const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyAdminToken } = require('../libs/Auth');
const { roles, fiveHundredResponse, twohundredResponse, fourNotOneResponse, resMessages, fourNotFourResponse, twoNotOneResponse } = require('../Utils/Helpers')
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 10 minutes
    max: 3, // 3 attempts
    message: 'Too many requests. Your account is locked for 10 minutes.',
});

//api to login admin
router.post('/adminLogin', limiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }
        const user = await User.findOne({ username });
        if (!user) {
            const errorMessage = fourNotFourResponse(resMessages.userNotfoundMsg);
            return res.status(404).json(errorMessage);
        }
        if (user.lockUntil > new Date()) {
            const errorMessage = fourNotOneResponse(resMessages.AccountLockedMsg);
            return res.status(401).json(errorMessage);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            user.loginAttempts += 1;

            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }

            await user.save();
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        if (user?.role !== "admin") {
            const errorMessage = fourNotFourResponse(resMessages.userNotfoundMsg);
            return res.status(404).json(errorMessage);
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "admin"
        }, "carmelpoly", { expiresIn: '1h' });

        const responseMsg = {
            greetings: `Welcome ${user.username.toUpperCase()} !!!`,
            message: resMessages.AuthSuccessMsg,
            accessType: roles.adminRole,
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

//api to create a new admin
router.post('/createNewAdmin', verifyAdminToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        const existingAdmin = await User.findOne({ username, role: "admin" });
        if (existingAdmin) {
            const errorMessage = fourNotOneResponse(resMessages.userAlreadyExistsMsg);
            return res.status(401).json(errorMessage);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "admin"
        });
        await user.save();
        const responseMsg = {
            resCode: 201,
            status: 'SUCCESS',
            message: 'created successfully.',
            accessToken: req.accessToken
        }
        const successResponseMsg = twoNotOneResponse(responseMsg);
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to create  new student
router.post('/createNewStudent', verifyAdminToken, async (req, res) => {
    try {
        const { username, password, semester, department } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        const existingStudent = await User.findOne({ username, role: "student" });
        if (existingStudent) {
            const errorMessage = fourNotOneResponse(resMessages.userAlreadyExistsMsg);
            return res.status(401).json(errorMessage);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "student",
            department,
            semester
        });
        await user.save();
        const responseMsg = {
            resCode: 201,
            status: 'SUCCESS',
            message: 'created successfully.',
            accessToken: req.accessToken
        }
        const successResponseMsg = twoNotOneResponse(responseMsg);
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to create  new teacher
router.post('/createNewTeacher', verifyAdminToken, async (req, res) => {
    try {
        const { username, password, department, semester } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse(resMessages.invalidMsg);
            return res.status(401).json(errorMessage);
        }

        const existingTeacher = await User.findOne({ username, role: "teacher" });
        if (existingTeacher) {
            const errorMessage = fourNotOneResponse(resMessages.userAlreadyExistsMsg);
            return res.status(401).json(errorMessage);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "teacher",
            semester: semester,
            department: department
        });

        await user.save();
        const responseMsg = {
            message: 'Teacher created successfully.',
            accessToken: req.accessToken
        }
        const successResponseMsg = twoNotOneResponse(responseMsg);
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

module.exports = router;