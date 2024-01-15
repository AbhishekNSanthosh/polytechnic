const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Auth = require('../libs/Auth');
const Letter = require('../Models/Letter');
const moment = require('moment');
const { fiveHundredResponse, twoNotOneResponse, twohundredResponse, resMessages, fourNotOneResponse, fourNotFourResponse, roles, abstractedUserData, customError, sanitizedLetterList } = require('../Utils/Helpers');
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 attempts
    message: 'Too many login attempts. Your account is locked for 10 minutes.',
});

const passwordlimiter = rateLimit({
    store: new rateLimit.MemoryStore({
        points: 3, // Number of attempts allowed
        duration: 3600, // 1 hour in seconds
    }),
    max: 3, // Max attempts per hour
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    message: "Too many password reset attempts. Please try again later.",
});

//api to login student
router.post('/teacherLogin', async (req, res) => {
    try {
        console.log(req.body)
        const { username, password } = req.body;

        if (!username) {
            throw { status: 400, message: "Username field is required" }
        } else if (!password) {
            throw { status: 400, message: "Password field is required" }
        }

        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid username" }
        }
        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid password" }
        }

        const user = await User.findOne({ username, role: "teacher" });

        if (!user) {
            throw { status: 404, message: resMessages.userNotfoundMsg }
        }

        if (user.lockUntil > new Date()) {
            const timeDifferenceInMilliseconds = user.lockUntil - new Date();
            const timeDifferenceInMinutes = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60));
            throw {
                status: 403, message: resMessages.AccountLockedMsg, description: `Please try again after ${timeDifferenceInMinutes} minutes`
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }
            await user.save();

            throw { status: 400, message: "Invalid username or password" }
        }

        if (user?.role !== "teacher") {
            throw { status: 404, message: resMessages.userNotfoundMsg }
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "teacher"
        }, "carmelpoly", { expiresIn: '1w' });

        const successResponseMsg = twohundredResponse({
            welcomeMesssage: `Welcome ${user.username.toUpperCase()} to Carmel Polytechnic Grievances`, message: resMessages.AuthSuccessMsg, accessType: roles.teacherRole,
            accessToken: token,
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

router.get('/getUserDetails', Auth.verifyTeacherToken, async (req, res) => {
    try {
        if (!req.user) {
            throw { status: 401, message: "Access denied", description: "Authentication token is missing or invalid." };
        }

        if (req.user) {
            const userData = abstractedUserData(req.user);
            const responseMsg = twohundredResponse({ data: userData, accessToken: req.accessToken });
            return res.status(200).json(responseMsg)
        }
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to add letter by teacher
router.post('/addLetter', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const { body, subject } = req.body;
        if (!subject && !body) {
            throw { status: 400, message: "Please fill the required fields" }
        }
        if (!subject) {
            throw { status: 400, message: "Subject field is required" }
        }
        if (!body) {
            throw { status: 400, message: "Body field is required" }
        }
        if (validator.isEmpty(subject) || !validator.trim(subject)) {
            throw { status: 400, messsage: "Invalid characters in subject" }
        }
        if (validator.isEmpty(body) || !validator.trim(body)) {
            throw { status: 400, messsage: "Invalid characters in body" }
        }
        const newLetter = new Letter({
            body,
            from: req.userId,
            subject,
            sender: req?.user?.role
        });

        const savedLetter = await newLetter.save();

        const successResponseMsg = twoNotOneResponse({ message: "Grievance created successfully", data: savedLetter });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

router.get('/getUserLetterById/:id', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        if (!letterId || letterId === "undefined" || letterId === null) {
            throw { status: 400, message: "Invalid letterId found", description: "Please provide a valid letterId." }
        }

        const letter = await Letter.findOne({ _id: letterId }).populate('from', '_id username email semester department');
        if (!letter) {
            throw {
                status: 404,
                message: "Letter not found",
                description: "The requested letter does not exist."
            };
        }

        if (letter?.from !== req?.userId) {
            throw {
                status: 403,
                message: "Access denied",
                description: "You do not have the necessary permissions to access this letter."
            };
        }
        const sanitizedLetter = {
            ...letter.toObject(),
            from: {
                _id: letter?.from?._id,
                username: letter?.from?.username,
                email: letter?.from?.email,
                semester: letter?.from?.semester,
                department: letter?.from?.department,
                role: letter?.from?.role,
            },
            createdAt: {
                date: moment(letter.createdAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.createdAt).fromNow(),
            },
            updatedAt: {
                date: moment(letter.updatedAt).format('DD/MM/YYYY , HH:mm'),
                ago: moment(letter.updatedAt).fromNow(),
            },
        }
        const successResponseMsg = twohundredResponse({
            message: "Here's your grievance:",
            data: sanitizedLetter,
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to get all letters send by the teacher
router.post('/getAllLetters', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const { sortOrder } = req.body;
        if (!sortOrder) {
            throw {
                status: 400,
                message: "Invalid sort method",
                description: "Provide a valid sorting order."
            };
        }
        const letters = await Letter.find({ from: req.userId }).sort({ createdAt: sortOrder }).populate('from', '_id username email semester department role');
       
        const sanitizedLetters = sanitizedLetterList(letters);

        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters send by you" : "All letters",
            data: sanitizedLetters.length === 0 ? [] : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});


router.get('/getUserLetterById/:id', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        if (!letterId) {
            throw { status: 400, message: "Invalid letterId" }
        }
        const letter = await Letter.findOne({ _id: letterId }).populate('from', 'username email semester department');
        if (!letter) {
            throw { status: 404, message: "Requested resource does not exists" }
        }
        const sanitizedLetter = {
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
        }
        const successResponseMsg = twohundredResponse({
            message: "Letter from ",
            data: sanitizedLetter,
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//teacher forgot password feature
router.post('/forgotPassword', passwordlimiter, async (req, res) => {
    try {
        const { email } = req.body;
        if (validator.isEmpty(email) || validator.matches(email, /[/\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }

        const user = await User.findOne({ email, role: "teacher" });
        if (!user) {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
            return res.status(404).json(errorMessage);
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, department: user?.department }, 'carmelpoly', { expiresIn: '1h' });

        // Send reset password email
        const resetPasswordUrl = `http://localhost:5172/reset-password?token=${token}`;

        const mailOptions = {
            from: 'abhisheksanthosh404@gmail.com',
            to: user.email,
            subject: 'Reset Your Carmel Polytechnic Grievances Password',
            html: `
                <p style="font-size: 14px; color: #333;">Hello <i>${user?.username}</i>,</p>
                <p style="font-size: 14px; color: #333;">You've requested to reset your password for Carmel Polytechnic Grievances.</p>
                <p style="font-size: 14px; color: #333;">Click the following link to reset your password:</p>
                <a href="${resetPasswordUrl}" style="font-size: 14px; color: #007BFF;">Reset Password</a>
                <p style="font-size: 14px; color: #333;">If you didn't request a password reset, you can ignore this email.</p>
                
                <hr style="border: 1px solid #ddd;">
        
                <p style="font-size: 14px; color: #333;"><strong>Instructions:</strong></p>
                <ul style="font-size: 14px; color: #333;">
                    <li>Click the "Reset Password" link above to set a new password.</li>
                    <li>Ensure that your new password is strong and secure.</li>
                    <li>If you continue to experience issues, please contact our support team.</li>
                </ul>
        
                <hr style="border: 1px solid #ddd;">
        
                <p style="font-size: 14px; color: #333;">Thank you for choosing Carmel Polytechnic Grievances. If you have any questions or need further assistance, please don't hesitate to contact our support team at:</p>
                
                <p style="font-size: 14px; color: #333;"><strong>Email:</strong> support@carmelpoly-grievances.com</p>
                <p style="font-size: 14px; color: #333;"><strong>Phone:</strong> +1 (555) 123-4567</p>
        
                <p style="font-size: 14px; color: #333;">Best regards,</p>
                <p style="font-size: 14px; color: #333;">The Carmel Polytechnic Grievances Team</p>
            `
        };

        user.resetTokenUsed = false;
        await user.save();
        await transporter.sendMail(mailOptions);
        const successMsg = twohundredResponse({ message: ['Reset password email sent successfully.', 'Please check your inbox'] })
        return res.status(200).json(successMsg);
    } catch (error) {
        console.error(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to validate token
router.post('/resetPassword', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (validator.isEmpty(newPassword) || validator.matches(newPassword, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: resMessages.invalidMsg });
            return res.status(401).json(errorMessage);
        }
        const decoded = jwt.verify(token, 'carmelpoly');

        const user = await User.findById(decoded.userId);
        console.log(user)
        if (!user) {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
            return res.status(404).json(errorMessage);
        } else if (user.resetTokenUsed) {
            const errorMessage = fourNotFourResponse({ message: "Password reset link expired! Please try after some time" });
            return res.status(400).json(errorMessage);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetTokenUsed = true;
        await user.save();

        const successResponse = twohundredResponse({ message: resMessages.passwordReset })
        return res.status(200).json(successResponse);
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            const errorResponse = fourNotOneResponse({ message: "Token has expired" })
            return res.status(401).json(errorResponse);
        }
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

router.post('/teacherPermittedLetters', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const { sortOrder } = req.body;
        if (!sortOrder) {
            throw { status: 400, message: 'Invalid sorting method' };
        }

        const requestingUserId = req.userId;
        if (!requestingUserId) {
            throw { status: 400, message: 'Invalid or missing user ID in the token' };
        }

        const letters = await Letter.find().sort({ updatedAt: sortOrder });
        const filteredLetters = letters.filter(letter => letter.viewAccessids.includes(requestingUserId));
        const successResponse = twohundredResponse({ message: "Here's your permitted grievances", data: filteredLetters })
        return res.json(successResponse);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to search letter
router.post('/searchLetter', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const { query } = req.body;
        if (validator.isEmpty(query) || validator.matches(query, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid characters in query" }
        }

        const letters = await Letter.find({
            $or: [
                { subject: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
        }).sort({ createdAt: "desc" });

        const sanitizedLetters = letters;
        const searchResCount = letters.length
        const successResponse = twohundredResponse({ message: "Search results:", data: sanitizedLetters, searchResCount });
        return res.status(200).json(successResponse);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to delete a letter
router.delete('/deleteLetterById/:letterId', Auth.verifyTeacherToken, async (req, res) => {
    try {
        const letterId = req.params.letterId;
        if (!letterId) {
            throw { status: 400, message: "Invalid letterId found" }
        }
        // Find the letter by ID
        const letter = await Letter.findById(letterId).populate('sender');
        if (!letter) {
            throw { status: 404, message: resMessages.notFoundMsg }
        }

        // Check if the sender has the role 'student'
        if (letter.sender !== 'teacher') {
            throw { status: 403, message: "Access denied" }
        }

        // Check if it's within one hour of sending the letter
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        console.log(letter?.createdAt.toLocaleString())
        console.log(oneHourAgo.toLocaleString())

        console.log(letter?.createdAt < oneHourAgo)

        if (letter?.createdAt < oneHourAgo) {
            throw { status: 400, message: "Letter cannot be deleted !", description: "More than one hour passed since sending" }
        }

        // Delete the letter
        await Letter.findByIdAndDelete(letterId);

        const successResponseMsg = twohundredResponse({ message: 'Letter deleted successfully' })
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || "";
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

module.exports = router;