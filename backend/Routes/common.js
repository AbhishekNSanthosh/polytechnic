const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const rateLimit = require('express-rate-limit');
const { twohundredResponse, customError } = require('../Utils/Helpers');

const passwordlimiter = rateLimit({
    store: new rateLimit.MemoryStore({
        points: 3, // Number of attempts allowed
        duration: 3600, // 1 hour in seconds
    }),
    max: 3, // Max attempts per hour
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    message: "Too many password reset attempts. Please try again later.",
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
        const resetPasswordUrl = `http://localhost:5172/reset-password/${token}`;

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
        const successMsg = twohundredResponse({ message: 'Reset password email sent successfully.', description: "Please contact administrator for more help" })
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