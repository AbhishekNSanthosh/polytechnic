const nodemailer = require('nodemailer');
const moment = require('moment');
const dotenv = require('dotenv');
const { unsubscribe } = require('../Routes/admin');
dotenv.config();

const roles = {
    adminRole: "admin",
    studentRole: "student",
    teacherRole: "teacher"
}

const currentTime = new Date();
let greeting;

// Determine the appropriate greeting based on the time of day
if (currentTime.getHours() < 12) {
    greeting = "Good morning";
} else if (currentTime.getHours() < 18) {
    greeting = "Good afternoon";
} else {
    greeting = "Good evening";
}

const twohundredResponse = (data = {}) => {
    return {
        greeting,
        hasError: false,
        resCode: 200,
        status: "SUCCESS",
        ...data,
        timestamp: currentTime.toISOString(),
        apiVersion: "V2",
        createdBy: "Carmel Polytechnic Professional Security",
        dev: "∞ Infinity ∞"
    };
};

const twoNotOneResponse = (data = {}) => {
    return {
        greeting,
        hasError: false,
        resCode: 201,
        status: "SUCCESS",
        ...data,
        timestamp: currentTime.toISOString(),
        apiVersion: "V2",
        createdBy: "Carmel Polytechnic Professional Security",
        dev: "∞ Infinity ∞"
    };
};

const fiveHundredResponse = () => {
    return {
        hasError: true,
        resCode: 500,
        status: "FAILURE",
        message: "Internal server error. Please try again later.",
        apiVersion: "V2"
    };
};

const fourNotOneResponse = (data = {}) => {
    return {
        hasError: true,
        resCode: 401,
        status: "FAILURE",
        ...data,
        apiVersion: "V2"
    };
};

const fourNotFourResponse = (data = {}) => {
    return {
        hasError: true,
        resCode: 404,
        status: "FAILURE",
        ...data,
        apiVersion: "V2"
    };
};

const fourNotThreeResponse = (data = {}) => {
    return {
        hasError: true,
        resCode: 403,
        status: "FAILURE",
        message: "Token not found. Authentication failed",
        ...data,
        apiVersion: "V2"
    };
};

const fourNotNineResponse = (data = {}) => {
    return {
        hasError: true,
        resCode: 409,
        status: "FAILURE",
        ...data,
        apiVersion: "V2"
    };
};

const fourHundredResponse = (data = {}) => {
    return {
        hasError: true,
        resCode: 400,
        status: "FAILURE",
        ...data,
        apiVersion: "V2"
    };
};

const customError = (data = {}) => {
    return {
        greeting,
        resCode: data.resCode || "UNKNOWN_ERROR",
        status: "FAILURE",
        hasError: true,
        error: data.error || null,
        message: data.message || "An unknown error occurred.",
        ...data,
        timestamp: currentTime.toISOString(),
        apiVersion: "V2",
        createdBy: "Carmel Polytechnic Professional Security",
        dev: "∞ Infinity ∞"
    }
}

const resMessages = {
    invalidMsg: "Invalid username or password!",
    accessDenied: "Access Denied",
    userNotfoundMsg: "User not found",
    notFoundMsg: "Requested resourse does not exists",
    internalErrorMsg: "Internal server error. Please try again!",
    AccountLockedMsg: 'Account is locked.',
    AuthSuccessMsg: "Authentication successful",
    userAlreadyExistsMsg: "Username already exists. Choose a different username.",
    emailAlreadyExistsMsg: "Email already exists. Choose a different email.",
    createdSuccessMsg: "Created successfully",
    tokenNotFound: "Token not found",
    unAuthorized: "Unauthorized access",
    sessionExpired: "Session expired",
    authFailed: "Authentication failed",
    rateLimit: "Too many requests. Please try after some time",
    passwordReset: "Password reset successfully"
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPASSKEY,
    },
});

const sanitizedUserList = (users) => {
    const userList = users.map(user => ({
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        semester: user?.semester,
        department: user?.department,
        role: user?.role,
        createdAt: {
            date: moment(user?.createdAt).format('DD/MM/YYYY , HH:mm'),
            ago: moment(user?.createdAt).fromNow(),
        },
        updatedAt: {
            date: moment(user?.createdAt).format('DD/MM/YYYY , HH:mm'),
            ago: moment(user?.createdAt).fromNow(),
        },
    }));
    return userList;
}

const sanitizedLetterList = (letters) => {
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
    return sanitizedLetters;
}

const sanitizedLetterData = (letter) => {
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
    return sanitizedLetter
}

const abstractedUserData = (userObj) => {
    const { password, loginAttempts, lockUntil, lastUpdatedBy, resetTokenUsed, ...userAbstractedObj } = userObj._doc;
    const newData = {
        username: userAbstractedObj?.username,
        email: userAbstractedObj?.email,
        password: userAbstractedObj?.password,
        semester: userAbstractedObj?.semester,
        department: userAbstractedObj.department,
        role: userAbstractedObj.role,
        createdAt: {
            date: moment(userAbstractedObj.createdAt).format('DD/MM/YYYY , HH:mm'),
            ago: moment(userAbstractedObj.createdAt).fromNow(),
        },
    }
    return newData;
}

const generatePdfContent = (letters) => {
    let html = '<html><body>';

    letters.forEach((letter) => {
        html += `
        <div style="margin-bottom: 20px;">
          <h2>${letter.subject}</h2>
          <p><strong>From:</strong> ${letter.from}</p>
          <p><strong>Date:</strong></p>
          <p>${letter.body}</p>
        </div>
      `;
    });

    html += '</body></html>';

    return { content: html };
};

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

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
    sanitizedUserList,
    abstractedUserData,
    sanitizedLetterList,
    sanitizedLetterData,
    customError,
    formatDate,
    resMessages,
    transporter
}