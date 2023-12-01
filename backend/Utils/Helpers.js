const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config();

const roles = {
    adminRole: "admin",
    studentRole: "student",
    teacherRole: "teacher"
}

const twohundredResponse = (data = {}) => {
    return {
        resCode: 200,
        status: "SUCCESS",
        ...data,
    };
};

const twoNotOneResponse = (data = {}) => {
    return {
        resCode: 201,
        status: "SUCCESS",
        ...data,
    };
};

const fiveHundredResponse = () => {
    return {
        resCode: 500,
        status: "FAILURE",
        message: "Internal server error. Please try again later."
    };
};

const fourNotOneResponse = (data = {}) => {
    return {
        resCode: 401,
        status: "FAILURE",
        ...data
    };
};

const fourNotFourResponse = (data = {}) => {
    return {
        resCode: 404,
        status: "FAILURE",
        ...data
    };
};

const fourNotThreeResponse = (data = {}) => {
    return {
        resCode: 403,
        status: "FAILURE",
        message: "Token not found. Authentication failed",
        ...data
    };
};

const fourNotNineResponse = (data = {}) => {
    return {
        resCode: 409,
        status: "FAILURE",
        ...data
    };
};

const fourHundredResponse = (data = {}) => {
    return {
        resCode: 400,
        status: "FAILURE",
        ...data
    };
};

const resMessages = {
    invalidMsg: "Invalid username or password!",
    userNotfoundMsg: "User not found",
    notFoundMsg: "Requested data not found",
    internalErrorMsg: "Internal server error. Please try again!",
    AccountLockedMsg: 'Account is locked. Try again later.',
    AuthSuccessMsg: "Authentication successfull",
    userAlreadyExistsMsg: "Username already exists. Choose a different username.",
    createdSuccessMsg: "Created successfully",
    tokenNotFound: "Token not found",
    unAuthorized: "Unauthorized access",
    sessionExpired: "Session expired",
    authFailed: "Authentication failed"
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPASSKEY,
    },
});

module.exports = {
    roles,
    twoNotOneResponse,
    fiveHundredResponse,
    twohundredResponse,
    fourNotOneResponse,
    fourNotFourResponse,
    fourNotThreeResponse,
    fourNotNineResponse,
    fourHundredResponse,
    resMessages,
    transporter
}