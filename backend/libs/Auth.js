const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Middleware to verify JWT tokens for checking admin authorization
const verifyAdminToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "failed",
            rescode: 403,
            message: "Token not found Authentication failed",
        });
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({
            resCode: 403,
            status: "FAILURE",
            message: "Token not found",
        });
    }
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && decoded.role !== "admin") {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: "Not Authorized",
            });
        }

        req.userId = decoded?.userId
        req.user = user?.username;
        req.accessToken = token
        req.user = user
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: 'Token has expired !'
            });
        } else {
            return res.status(401).json({
                statusCode: 401,
                status: "FAILURE",
                message: 'Authentication failed'
            });
        }
    }
};

// Middleware to verify JWT tokens for checking student authorization
const verifyStudentToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "failed",
            code: 403,
            message: "Token not found Authentication failed",
        });
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({
            resCode: 403,
            status: "FAILURE",
            message: "Token not found",
        });
    }
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && decoded.role !== "student") {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: "Not Authorized",
            });
        }

        req.userId = decoded?.userId
        req.user = user?.username;
        req.accessToken = token
        req.user = user
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: 'Token has expired !'
            });
        } else {
            return res.status(401).json({
                statusCode: 401,
                status: "FAILURE",
                message: 'Authentication failed'
            });
        }
    }
};

// Middleware to verify JWT tokens for checking teacher authorization
const verifyTeacherToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "failed",
            code: 403,
            message: "Token not found Authentication failed",
        });
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({
            resCode: 403,
            status: "FAILURE",
            message: "Token not found",
        });
    }
    try {
        const decoded = jwt.verify(token, 'carmelpoly');
        const user = await User.findOne({ _id: decoded.userId })

        if (decoded.username !== user?.username && decoded.role !== "teacher") {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: "Not Authorized",
            });
        }

        req.userId = decoded?.userId
        req.user = user?.username;
        req.accessToken = token
        req.user = user
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                resCode: 401,
                status: "FAILURE",
                message: 'Token has expired !'
            });
        } else {
            return res.status(401).json({
                statusCode: 401,
                status: "FAILURE",
                message: 'Authentication failed'
            });
        }
    }
};

module.exports = {
    verifyAdminToken,
    verifyStudentToken,
    verifyTeacherToken
};