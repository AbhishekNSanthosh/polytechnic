const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { resMessages, fourNotThreeResponse, fourNotOneResponse } = require('../Utils/Helpers');

// Middleware to verify JWT tokens for checking admin authorization
const verifyAdminToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.tokenNotFound });
        return res.status(403).json(errorMessage);
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.tokenNotFound });
        return res.status(403).json(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && decoded.role !== "admin") {
            const errorMessage = fourNotOneResponse({ message: resMessages.unAuthorized });
            return res.status(401).json(errorMessage);
        }
        if (decoded.role === "admin" && user?.role === "admin") {
            req.userId = decoded?.userId
            req.accessToken = token
            req.user = user
            next();
        } else {
            const errorMessage = fourNotOneResponse({ message: resMessages.unAuthorized });
            return res.status(401).json(errorMessage);
        }
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            const errorMessage = fourNotOneResponse({ message: resMessages.sessionExpired, error: 'TokenExpiredError' });
            return res.status(401).json(errorMessage);
        } else {
            const errorMessage = fourNotOneResponse({ message: resMessages.authFailed });
            return res.status(401).json(errorMessage);
        }
    }
};

// Middleware to verify JWT tokens for checking student authorization
const verifyStudentToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.accessDenied });
        return res.status(403).json(errorMessage);
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.tokenNotFound });
        return res.status(403).json(errorMessage);
    }
    console.log(token)
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && decoded.role !== "student") {
            const errorMessage = fourNotOneResponse({ message: resMessages.unAuthorized });
            return res.status(401).json(errorMessage);
        }

        if (decoded.role === "student" && user?.role === "student") {
            req.userId = decoded?.userId
            req.accessToken = token
            req.user = user
            next();
        } else {
            const errorMessage = fourNotOneResponse({ message: resMessages.unAuthorized });
            return res.status(401).json(errorMessage);
        }
    } catch (error) {
        console.log(error.message)
        if (error.name === 'TokenExpiredError') {
            const errorMessage = fourNotOneResponse({ message: resMessages.sessionExpired ,error: 'TokenExpiredError'});
            return res.status(401).json(errorMessage);
        } else {
            const errorMessage = fourNotOneResponse({ message: resMessages.authFailed });
            return res.status(401).json(errorMessage);
        }
    }
};

// Middleware to verify JWT tokens for checking teacher authorization
const verifyTeacherToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.invalidMsg });
        return res.status(403).json(errorMessage);
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const errorMessage = fourNotThreeResponse({ message: resMessages.tokenNotFound });
        return res.status(403).json(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && (user?.role !== "teacher" && decoded.role !== "teacher")) {
            const errorMessage = fourNotOneResponse({ message: resMessages.unAuthorized });
            return res.status(401).json(errorMessage);
        }

        if (decoded.role === "teacher" && user?.role === "teacher") {
            req.userId = decoded?.userId
            req.accessToken = token
            req.user = user
            next();
        } else {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: "Not Authorized",
            });
        }
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            const errorMessage = fourNotOneResponse({ message: resMessages.sessionExpired,error: 'TokenExpiredError' });
            return res.status(401).json(errorMessage);
        } else {
            const errorMessage = fourNotOneResponse({ message: resMessages.authFailed });
            return res.status(401).json(errorMessage);
        }
    }
};

module.exports = {
    verifyAdminToken,
    verifyStudentToken,
    verifyTeacherToken
};