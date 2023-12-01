const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyAdminToken } = require('../libs/Auth');
const { roles, fiveHundredResponse, twohundredResponse, fourNotOneResponse, resMessages, fourNotFourResponse, twoNotOneResponse, fourNotNineResponse } = require('../Utils/Helpers');
const Letter = require('../Models/Letter');
const moment = require('moment');

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
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }
        const user = await User.findOne({ username });
        if (!user) {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
            return res.status(404).json(errorMessage);
        }
        if (user.lockUntil > new Date()) {
            const errorMessage = fourNotOneResponse({ message: resMessages.AccountLockedMsg });
            return res.status(401).json(errorMessage);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            user.loginAttempts += 1;

            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }

            await user.save();
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        if (user?.role !== "admin") {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
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

//api to get admin info && token is valid or not
router.get('/getUserDetails', verifyAdminToken, async (req, res) => {
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

//api to create a new admin
router.post('/createNewAdmin', verifyAdminToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        const existingAdmin = await User.findOne({ username, role: "admin" });
        if (existingAdmin) {
            const errorMessage = fourNotNineResponse({ message: resMessages.userAlreadyExistsMsg });
            return res.status(409).json(errorMessage);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "admin"
        });
        const savedUser = await user.save();
        const userWithoutPassword = {
            _id: savedUser._id,
            username: savedUser.username,
            username: savedUser.email,
            role: savedUser.role,
            semester: savedUser.semester,
            department: savedUser.department
        };
        const responseMsg = {
            resCode: 201,
            status: 'SUCCESS',
            message: 'created successfully.',
            userData: userWithoutPassword,
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
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        const existingStudent = await User.findOne({ username, role: "student" });
        if (existingStudent) {
            const errorMessage = fourNotNineResponse({ message: resMessages.userAlreadyExistsMsg });
            return res.status(409).json(errorMessage);
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
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        const existingTeacher = await User.findOne({ username, role: "teacher" });
        if (existingTeacher) {
            const errorMessage = fourNotNineResponse({ message: resMessages.userAlreadyExistsMsg });
            return res.status(409).json(errorMessage);
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

//api to get all letters
router.get('/getAllLetters', verifyAdminToken, async (req, res) => {
    try {
        const letters = await Letter.find().sort({ createdAt: 'desc' }).populate('from', 'username email department semester role');
        const sanitizedLetters = letters.map(letter => ({
            ...letter.toObject(),
            from: {
                username: letter.from.username,
                email: letter.from.email,
                semester: letter.from.semester,
                department: letter.from.department,
                role: letter.from.role,
            },
            createdAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
            updatedAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
        }));
        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters " : "All letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to get all letters send by the student
router.get('/getAllStudentLetters', verifyAdminToken, async (req, res) => {
    try {
        const letters = await Letter.find({ sender: "student" }).sort({ createdAt: 'desc' }).populate('from', 'username email role semester department');
        const sanitizedLetters = letters.map(letter => ({
            ...letter.toObject(),
            from: {
                username: letter.from.username,
                email: letter.from.email,
                semester: letter.from.semester,
                department: letter.from.department,
                role: letter.from.role,
            },
            createdAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
            updatedAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
        }));
        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters send by student" : "All student letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to get all letters send by the student
router.get('/getAllTeacherLetters', verifyAdminToken, async (req, res) => {
    try {
        const letters = await Letter.find({ sender: "teacher" }).sort({ createdAt: 'desc' }).populate('from', 'username email department semester role');
        const sanitizedLetters = letters.map(letter => ({
            ...letter.toObject(),
            from: {
                username: letter.from.username,
                email: letter.from.email,
                semester: letter.from.semester,
                department: letter.from.department,
                role: letter.from.role,
            },
            createdAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
            updatedAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
        }));
        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters send by teacher" : "All teacher letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to allow view access to teacher
router.post('/addViewAccessIds/:letterId', async (req, res) => {
    const { userIds } = req.body;

    try {
        const letterId = req.params.letterId;

        const letter = await Letter.findById(letterId);

        if (!letter) {
            const errorMessage = fourNotFourResponse({ message: resMessages.notFoundMsg });
            return res.status(404).json(errorMessage);
        }

        const users = await User.find({ _id: { $in: userIds } ,role:"teacher"});

        if (users.length !== userIds.length) {
            const errorMessage = fourNotFourResponse({ message: 'Some users not found' });
            return res.status(404).json(errorMessage);
        }

        // Add each user ID to the viewAccessids array
        userIds.forEach(userId => {
            if (!letter.viewAccessids.includes(userId)) {
                letter.viewAccessids.push(userId);
            }
        });

        // Save the updated letter
        const updatedLetter = await letter.save();
        const updated = {
            viewAccessids: updatedLetter.viewAccessids
        }
        const successResponseMsg = twoNotOneResponse({
            message: "View access IDs added successfully",
            data: updated
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

module.exports = router;