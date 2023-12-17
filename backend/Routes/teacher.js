const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyTeacherToken } = require('../libs/Auth');
const Letter = require('../Models/Letter');
const { fiveHundredResponse, twoNotOneResponse, twohundredResponse, resMessages, fourNotOneResponse, fourNotFourResponse, roles } = require('../Utils/Helpers');
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
router.post('/teacherLogin', limiter, async (req, res) => {
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
        const user = await User.findOne({ username, role: "teacher" });

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

        if (user?.role !== "teacher") {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
            return res.status(404).json(errorMessage);
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "teacher"
        }, "carmelpoly", { expiresIn: '1h' });

        const responseMsg = {
            greetings: `Welcome ${user.username.toUpperCase()} !!!`,
            message: resMessages.AuthSuccessMsg,
            accessType: roles.teacherRole,
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

router.get('/getUserDetails', verifyTeacherToken, async (req, res) => {
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

//api to add letter by teacher
router.post('/addLetter', verifyTeacherToken, async (req, res) => {
    const { body, subject } = req.body;

    try {
        if (validator.isEmpty(body) || !validator.trim(body) || validator.matches(body, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: "Invalid body" });
            return res.status(400).json(errorMessage);
        }

        if (validator.isEmpty(subject) || !validator.trim(subject) || validator.matches(subject, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: "Invalid subject" });
            return res.status(400).json(errorMessage);
        }
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

//api to get all letters send by the teacher
router.get('/getAllLetters', verifyTeacherToken, async (req, res) => {
    try {
        const letters = await Letter.find({ from: req.userId }).sort({ createdAt: 'desc' }).populate('from', 'username email semester department role');
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
            message: letters.length === 0 ? "No letters send by you" : "All letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});


router.get('/getUserLetterById/:id', verifyTeacherToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        const letter = await Letter.findOne({ _id:letterId}).populate('from','username email semester department');
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
            message:"Letter from ",
            data: sanitizedLetter,
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
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


module.exports = router;