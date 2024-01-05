const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const logo = path.resolve(__dirname, '../Utils/Images/carmellogo.png')
const { twohundredResponse, customError, transporter, resMessages } = require('../Utils/Helpers');

const passwordlimiter = rateLimit({
    store: new rateLimit.MemoryStore({
        points: 3, // Number of attempts allowed
        duration: 3600, // 1 hour in seconds
    }),
    max: 3, // Max attempts per hour
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    handler: (req, res) => {
        const errorMessage = customError({ resCode: 429, message: "Too many password reset attempts.", description: " Please try again later." })
        return res.status(429).json(errorMessage);
    },
});

//student forgot password feature
router.post('/forgotPassword', passwordlimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw { status: 400, message: "Email field is required" }
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw { status: 404, message: "User does not exists", description: "Please contact administrator" }
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, department: user?.department }, 'carmelpoly', { expiresIn: '1h' });

        // Send reset password email
        const resetPasswordUrl = `http://localhost:5173/reset-password/${token}`;

        // const mailOptions = {
        //     from: 'abhisheksanthosh404@gmail.com',
        //     to: user.email,
        //     subject: 'Reset Your Carmel Polytechnic Grievances Password',
        //     html: `
        //         <p style="font-size: 14px; color: #333;">Hello <i>${user?.username}</i>,</p>
        //         <p style="font-size: 14px; color: #333;">You've requested to reset your password for Carmel Polytechnic Grievances.</p>
        //         <p style="font-size: 14px; color: #333;">Click the following link to reset your password:</p>
        //         <a href="${resetPasswordUrl}" style="font-size: 14px; color: #007BFF;">Reset Password</a>
        //         <p style="font-size: 14px; color: #333;">If you didn't request a password reset, you can ignore this email.</p>

        //         <hr style="border: 1px solid #ddd;">

        //         <p style="font-size: 14px; color: #333;"><strong>Instructions:</strong></p>
        //         <ul style="font-size: 14px; color: #333;">
        //             <li>Click the "Reset Password" link above to set a new password.</li>
        //             <li>Ensure that your new password is strong and secure.</li>
        //             <li>If you continue to experience issues, please contact our support team.</li>
        //         </ul>

        //         <hr style="border: 1px solid #ddd;">

        //         <p style="font-size: 14px; color: #333;">Thank you for choosing Carmel Polytechnic Grievances. If you have any questions or need further assistance, please don't hesitate to contact our support team at:</p>

        //         <p style="font-size: 14px; color: #333;"><strong>Email:</strong> support@carmelpoly-grievances.com</p>
        //         <p style="font-size: 14px; color: #333;"><strong>Phone:</strong> +1 (555) 123-4567</p>

        //         <p style="font-size: 14px; color: #333;">Best regards,</p>
        //         <p style="font-size: 14px; color: #333;">The Carmel Polytechnic Grievances Team</p>
        //     `
        // };

        const mailOptions = {
            from: 'abhisheksanthosh404@gmail.com',
            to: user.email,
            subject: 'Reset Your Carmel Polytechnic Grievances Password',
            html: `
                <div style="background-image: url('https://img.freepik.com/free-vector/cartoon-galaxy-background_23-2148984167.jpg?size=626&ext=jpg&ga=GA1.1.1475327329.1698553788&semt=ais'); background-size: cover; background-position: center; padding: 20px; font-family: 'Arial', sans-serif;">
                <div style="max-width: 100%; background-color: rgba(255, 255, 255, 0.8); border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <div style="padding: 0 20px; text-align: center;">
                            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hello <strong>${user?.username}</strong>,</p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">You've requested to reset your password for Carmel Polytechnic Grievances.</p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Click the following link to reset your password:</p>
                            <p style="margin-bottom: 30px;"><a href="${resetPasswordUrl}" style="font-size: 18px; color: #007BFF; text-decoration: none; padding: 10px 20px; border-radius: 5px; background-color: #007BFF; color: #fff; display: inline-block;">Reset Password</a></p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">If you didn't request a password reset, you can ignore this email.</p>
                        </div>
                        
                        <hr style="border: 1px solid #ddd; margin: 40px 0;">
        
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://polytechnic.vercel.app/assets/carmellogo-tkXQE7CQ.png" alt="Carmel Polytechnic Grievances" style="height: 5rem;">
                        </div>
                        
                        <div style="padding: 0 20px; text-align: center;">
                            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Thank you for choosing Carmel Polytechnic Grievances. We are dedicated to providing exceptional support to our users.</p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">If you have any questions or need further assistance, please don't hesitate to contact our support team at:</p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 10px;"><strong>Email:</strong> support@carmelpoly-grievances.com</p>
                            <p style="font-size: 16px; color: #333; margin-bottom: 30px;"><strong>Phone:</strong> +1 (555) 123-4567</p>
                        </div>
        
                        <div style="background-color: red; color: #fff; padding: 20px; text-align: center;">
                            <p style="font-size: 16px; margin: 0;">Best regards,<br>The Carmel Polytechnic Grievances Team</p>
                            <p style="font-size: 14px; margin-top: 10px;">© 2024 Carmel Polytechnic Grievances. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `,
        };




        user.resetTokenUsed = false;
        await user.save();
        await transporter.sendMail(mailOptions);
        const successMsg = twohundredResponse({ message: 'Reset password email sent successfully.', description: 'Please check your inbox including spam' })
        return res.status(200).json(successMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to validate token
router.post('/resetPassword', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (token === null || !token || token === 'undefined') {
            throw { status: 400, message: "Token not found" }
        }

        if (!newPassword) {
            throw { status: 400, message: "Please fill the required fields" }
        }

        const decoded = jwt.verify(token, 'carmelpoly');

        const user = await User.findById(decoded.userId);
        console.log("Decoded user => \n", user)
        if (!user) {
            throw { status: 404, message: "User does not exists", description: "Please contact administrator for more help" }
        } else if (user.resetTokenUsed) {
            throw { status: 400, message: "Password reset link expired!", description: "Please try after some time" }

        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetTokenUsed = true;
        await user.save();

        const successResponse = twohundredResponse({ message: resMessages.passwordReset })
        return res.status(200).json(successResponse);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

module.exports = router;