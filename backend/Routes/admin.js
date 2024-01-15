const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Auth = require('../libs/Auth');
const json2csv = require('json2csv').parse;
const pdfmake = require('pdfmake');
const path = require('path');

const {
    roles,
    twohundredResponse,
    resMessages,
    twoNotOneResponse,
    sanitizedUserList,
    abstractedUserData,
    customError,
    sanitizedLetterList,
    sanitizedLetterData,
    formatDate,
} = require('../Utils/Helpers');
const Letter = require('../Models/Letter');
const XLSX = require('xlsx');
const multer = require('multer');
const { validationResult } = require('express-validator');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const deps = ["CSE", 'EEE', 'CIVIL', 'MECH', 'AUTOMOBILE', 'ELECTRONICS']
const sems = ['S1', 'S2', "S3", 'S4', 'S5', 'S6']
const rateLimitError = (req, res) => {
    return res.status(429).json({
        resCode: 429,
        status: "FAILURE",
        message: resMessages.rateLimit
    })
};

const limiter = rateLimit({
    windowMs: 5 * 1000, // 2 seconds
    max: 5, // 3 attempts
    handler: rateLimitError,
});

//api to login admin
router.post('/adminLogin', async (req, res) => {
    console.log(req.body)
    console.log(req.ip)
    const userIpAddress = req.ip
    try {
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

        const user = await User.findOne({ username });
        console.log(user)
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

        if (user?.role !== "admin") {
            throw { status: 404, message: resMessages.userNotfoundMsg }
        }

        user.loginAttempts = 0;
        user.lockUntil = new Date(0);
        await user.save();

        const token = jwt.sign({
            username: user.username, userId: user._id, role: "admin"
        }, "carmelpoly", { expiresIn: '1h' });

        const responseMsg = {
            welcomeMesssage: `Welcome ${user.username.toUpperCase()} !!!`,
            message: resMessages.AuthSuccessMsg,
            accessType: roles.adminRole,
            accessToken: token,
        }

        const successResponseMsg = twohundredResponse({ welcomeMesssage: `Welcome ${user.username.toUpperCase()} !!!`,,message: resMessages.AuthSuccessMsg, accessType: roles.adminRole, });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description, userIpAddress })
        return res.status(status).json(errorMessage);
    }
});

//api to get admin info && token is valid or not
router.get('/getUserDetails', Auth.verifyAdminToken, async (req, res) => {
    try {
        if (req.user) {
            const userData = abstractedUserData(req.user);
            const responseMsg = twohundredResponse({ data: userData, accessToken: req.accessToken });
            return res.status(200).json(responseMsg)
        }
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to create a new admin
router.post('/createNewAdmin', Auth.verifyAdminToken, async (req, res) => {
    try {
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

        const existingAdmin = await User.findOne({ username, role: "admin" });
        if (existingAdmin) {
            throw { status: 409, message: resMessages.userAlreadyExistsMsg }
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "admin"
        });
        const savedUser = await user.save();
        const userData = abstractedUserData(savedUser);

        const successResponseMsg = twoNotOneResponse({ message: 'New admin created successfully', data: userData });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to create  new student
router.post('/createNewStudent', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { username, password, email, semester, department } = req.body;

        if (!username && !password && !email && !semester && !department) {
            throw { status: 400, message: "Please fill the required fields" }
        }

        if (!username) {
            throw { status: 400, message: "Username field is required" }
        } else if (!password) {
            throw { status: 400, message: "Password field is required" }
        } else if (!email) {
            throw { status: 400, message: "Email field is required" }
        } else if (!department) {
            throw { status: 400, message: "Department field is required" }
        } else if (!semester) {
            throw { status: 400, message: "Semester field is required" }
        }

        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid username" }
        }
        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid password" }
        }

        if (!deps.includes(department)) {
            throw { status: 400, message: "Please enter valid department" }
        }

        if (!sems.includes(semester)) {
            throw { status: 400, message: "Please enter valid semester" }
        }

        const existingStudent = await User.findOne({ username, role: "student" });
        const existingByEmail = await User.findOne({ email, role: "student" });

        if (existingStudent) {
            throw { status: 409, message: "Username already exists.", description: "Choose a different username." }
        }

        if (existingByEmail) {
            throw { status: 409, message: "Email already exists.", description: "Choose a different email." }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            email,
            role: "student",
            department,
            semester
        });
        const savedUser = await user.save();
        const userData = abstractedUserData(savedUser);

        const successResponseMsg = twoNotOneResponse({ message: 'New student created successfully', data: userData });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to create  new teacher
router.post('/createNewTeacher', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { username, password, department, email } = req.body;

        if (!username && !password && !email && !department) {
            throw { status: 400, message: "Please fill the required fields" }
        }

        if (!username) {
            throw { status: 400, message: "Username field is required" }
        } else if (!password) {
            throw { status: 400, message: "Password field is required" }
        } else if (!email) {
            throw { status: 400, message: "Email field is required" }
        } else if (!department) {
            throw { status: 400, message: "Department field is required" }
        }

        if (validator.isEmpty(username) || validator.matches(username, /[/\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid username" }
        }

        if (validator.isEmpty(password) || validator.matches(password, /[/\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid password" }
        }

        if (!deps.includes(department)) {
            throw { status: 400, message: "Please enter valid department" }
        }

        const existingUserByUsername = await User.findOne({ username, role: "teacher" });
        const existingUserByEmail = await User.findOne({ email, role: "teacher" });
        if (existingUserByUsername) {
            throw { status: 409, message: "Username already exists.", description: "Choose a different username." }
        }

        if (existingUserByEmail) {
            throw { status: 409, message: "Email already exists.", description: "Choose a different email." }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
            role: "teacher",
            email: email,
            department: department
        });

        const savedUser = await user.save();
        const userData = abstractedUserData(savedUser);

        const successResponseMsg = twoNotOneResponse({ message: 'New teacher created successfully', data: userData });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to get all letters
router.post('/getAllLetters', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { sortOrder } = req.body
        const letters = await Letter.find().sort({ createdAt: sortOrder }).populate('from', 'username email department semester role');
        const sanitizedLetters = sanitizedLetterList(letters);
        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters " : "All letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to get single letter
router.get('/getUserLetterById/:id', Auth.verifyAdminToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        if (letterId === "undefined" || !letterId) {
            throw { status: 400, message: "Invalid grievance id. Please provide a valid id." }
        }
        const letter = await Letter.findOne({ _id: letterId }).populate('from', 'username email semester department');
        if (!letter) {
            throw { status: 404, message: "Letter not found. Please check the provided id." }
        }
        const sanitizedLetter = sanitizedLetterData(letter);
        const successResponseMsg = twohundredResponse({
            message: "Letter from: " + letter?.from?.username,
            data: sanitizedLetter,
        });
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});


//api to get all letters send by the student
router.get('/getAllStudentLetters', Auth.verifyAdminToken, async (req, res) => {
    try {
        const letters = await Letter.find({ sender: "student" }).sort({ createdAt: 'desc' }).populate('from', 'username email role semester department');
        const sanitizedLetters = sanitizedLetterList(letters)

        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters send by student" : "All student letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const errorMessage = customError({ resCode: status, message })
        return res.status(status).json(errorMessage);
    }
})

//api to get all letters send by the student
router.get('/getAllTeacherLetters', Auth.verifyAdminToken, async (req, res) => {
    try {
        const letters = await Letter.find({ sender: "teacher" }).sort({ createdAt: 'desc' }).populate('from', 'username email department semester role');
        const sanitizedLetters = sanitizedLetterList(letters)

        const successResponseMsg = twohundredResponse({
            message: letters.length === 0 ? "No letters send by teacher" : "All teacher letters",
            data: sanitizedLetters.length === 0 ? null : sanitizedLetters,
            letterCount: letters.length
        });
        return res.status(201).json(successResponseMsg);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to allow view access to teacher
router.post('/addViewAccessIds/:letterId', async (req, res) => {
    try {
        const { userIds } = req.body;
        const letterId = req.params.letterId;
        if (!letterId || letterId === "undefined") {
            throw { status: 400, message: "Invalid grievance id" }
        }
        const letter = await Letter.findById(letterId);

        if (!letter) {
            throw { status: 404, message: resMessages.notFoundMsg }
        }

        const users = await User.find({ _id: { $in: userIds }, role: "teacher" });
        if (users.length !== userIds.length) {
            throw { status: 404, message: 'Some users not found' }
        }

        // Remove all existing viewAccessids
        letter.viewAccessids = [];

        // Add each user ID to the viewAccessids array
        userIds.forEach(userId => {
            letter.viewAccessids.push(userId);
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
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});


//api to upload bulk user data via xlsx
router.post('/uploadManyStudents', Auth.verifyAdminToken, upload.single('file'), async (req, res) => {
    try {
        const errors = validationResult(req);
        const deps = ['CSE', 'EEE', 'CIVIL', 'MECH', 'AUTOMOBILE', 'ELECTRONICS']
        if (!errors.isEmpty()) {
            // Validation errors in the request body
            throw { status: 400, message: errors.array() }
        }

        if (!req.file) {
            // No file uploaded
            throw { status: 400, message: 'File not provided' }
        }

        // Get the buffer containing the file data
        const fileData = req.file.buffer;

        // Process Excel file (assuming single sheet for simplicity)
        const workbook = XLSX.read(fileData, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            // No sheet found in the Excel file
            throw { status: 400, message: 'No sheet found in the Excel file' }
        }

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData || jsonData.length === 0) {
            // No data found in the Excel sheet
            throw { status: 400, message: "No data found in the Excel sheet" }
        }

        const existingUsers = await User.find({
            $and: [
                { role: 'student' },
                { username: { $in: jsonData.map(student => student.username) } }
            ]
        });

        if (existingUsers.length > 0) {

            const duplicates = existingUsers.map(user => ({
                username: user.username,
                semester: user.semester,
                department: user.department,
            }));

            throw { status: 409, title: 'Duplicate data found!', message: 'Some usernames are already taken. Please choose unique usernames.', showModal: true, duplicates, }
        }

        const studentsToInsert = await Promise.all(jsonData.map(async (student) => {
            if (!deps.includes(student?.department)) {
                throw { status: 400, message: `Please add a valid department for the user: ${student?.username}` }
            }
            if (!student.username) {
                throw { status: 400, message: `Username field missing for user: ${student.username} ` }
            }
            if (!student.email) {
                throw { status: 400, message: `Email field missing for user: ${student.username} ` }
            }
            if (!student.semester) {
                throw { status: 400, message: `Semester field missing for user: ${student.username} ` }
            }
            if (!student.department) {
                throw { status: 400, message: `Department field missing for user: ${student.username} ` }
            }
            if (!student.password) {
                throw { status: 400, message: `Password field missing for user: ${student.username} ` }
            }

            const pass = JSON.stringify(student.password);
            const hashedPassword = await bcrypt.hash(pass, 12);

            return {
                ...student,
                password: hashedPassword,
            };
        }));

        // Insert students into MongoDB
        const students = await User.insertMany(studentsToInsert);

        // Respond with success message
        const successResponse = twoNotOneResponse({ message: `${students.length} students data added successfully`, accessToken: req.accessToken });
        return res.status(201).json(successResponse);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const showModal = error.showModal
        const duplicates = error.duplicates
        const errorMessage = customError({ resCode: status, message, showModal, duplicates })
        return res.status(status).json(errorMessage);
    }
});

//api to upload bulk user data via xlsx
router.post('/uploadManyTeacher', Auth.verifyAdminToken, upload.single('file'), async (req, res) => {
    try {
        const errors = validationResult(req);
        const deps = ['CSE', 'EEE', 'CIVIL', 'MECH', 'AUTOMOBILE', 'ELECTRONICS']
        if (!errors.isEmpty()) {
            // Validation errors in the request body
            throw { status: 400, message: errors.array() }
        }

        if (!req.file) {
            // No file uploaded
            throw { status: 400, message: 'File not provided' }
        }

        // Get the buffer containing the file data
        const fileData = req.file.buffer;

        // Process Excel file (assuming single sheet for simplicity)
        const workbook = XLSX.read(fileData, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            // No sheet found in the Excel file
            throw { status: 400, message: 'No sheet found in the Excel file' }
        }

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData || jsonData.length === 0) {
            // No data found in the Excel sheet
            throw { status: 400, message: "No data found in the Excel sheet" }
        }

        const existingUsers = await User.find({
            $and: [
                { role: 'teacher' },
                { username: { $in: jsonData.map(teacher => teacher.username) } }
            ]
        });

        if (existingUsers.length > 0) {

            const duplicates = existingUsers.map(user => ({
                username: user.username,
                semester: user.semester,
                department: user.department,
            }));

            throw { status: 409, title: 'Duplicate data found!', message: 'Some usernames are already taken. Please choose unique usernames.', showModal: true, duplicates, }
        }

        const studentsToInsert = await Promise.all(jsonData.map(async (teacher) => {
            if (!deps.includes(teacher?.department)) {
                throw { status: 400, message: `Please add a valid department for the user: ${teacher?.username}` }
            }
            if (!teacher.username) {
                throw { status: 400, message: `Username field missing for user: ${teacher.username} ` }
            }
            if (!teacher.email) {
                throw { status: 400, message: `Email field missing for user: ${teacher.username} ` }
            }
            if (!teacher.department) {
                throw { status: 400, message: `Department field missing for user: ${teacher.username} ` }
            }
            if (!teacher.password) {
                throw { status: 400, message: `Password field missing for user: ${teacher.username} ` }
            }

            const pass = JSON.stringify(teacher.password);
            const hashedPassword = await bcrypt.hash(pass, 12);

            return {
                ...teacher,
                role: "teacher",
                password: hashedPassword,
            };
        }));

        // Insert students into MongoDB
        const students = await User.insertMany(studentsToInsert);
        console.log(students)
        // Respond with success message
        const successResponse = twoNotOneResponse({ message: `${students.length} teachers data added successfully`, accessToken: req.accessToken });
        return res.status(201).json(successResponse);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const showModal = error.showModal
        const duplicates = error.duplicates
        const errorMessage = customError({ resCode: status, message, showModal, duplicates })
        return res.status(status).json(errorMessage);
    }
});

//api to send mail to share the email and password to students
// router.get('/shareUserCredentials', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' });

//         students.forEach(async (student) => {

//             // Update the user's password in the database
//             const decodedPasword = await bcrypt(password, student.password);

//             console.log(decodedPasword)
//             // Send email with temporary password
//             const mailOptions = {
//                 from: 'abhisheksanthosh404@gmail.com',
//                 to: student.email,
//                 subject: 'Welcome to NoteNest - Your Temporary Password',
//                 text: `Hello ${ student.username } !\n\nYour temporary password is: ${ tempPassword } `,
//                 html: `< p > Hello ${ student.username } !</p >
//                  <p>Your temporary password is: ${tempPassword}</p>
//                  <p>Please log in and reset your password as soon as possible.</p>`,
//             };

//             // transporter.sendMail(mailOptions, (error, info) => {
//             //     if (error) {
//             //         console.log(`Error sending email to ${student.email}:`, error);
//             //     } else {
//             //         console.log(`Email sent to ${student.email}:`, info.response);
//             //     }
//             // });
//         });

//         res.status(200).json({
//             status: 200,
//             message: 'Emails sent successfully.',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             message: 'Internal Server Error',
//         });
//     }
// });

//api to get all students
router.post('/getUserListByRole', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { role } = req.body;
        let message;
        if (role === "student") {
            message = "All students";
        } else if (role === "admin") {
            message = "All admins";
        } else if (role === "teacher") {
            message = "All teachers";
        } else {
            message = "Invalid role";
            data = null;
        }
        const users = await User.find({ role: role }).sort({ createdAt: 'desc' });
        const usersData = sanitizedUserList(users);
        const successMsg = twohundredResponse({
            message,
            data: usersData.length === 0 ? null : usersData,
            studentsCount: usersData.length,
            accessToken: req.acessToken
        })
        return res.status(200).json(successMsg)
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to filter students by sem dep etc
router.post('/getUserListByFilters', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { role, semester, department, sortOrder } = req.body;
        let message;
        let users;

        if (role === "student") {
            if (semester && department) {
                users = await User.find({ role, semester, department }).sort({ createdAt: sortOrder });
            } else if (semester) {
                users = await User.find({ role, semester }).sort({ createdAt: sortOrder });
            } else if (department) {
                users = await User.find({ role, department }).sort({ createdAt: sortOrder });
            } else {
                users = await User.find({ role }).sort({ createdAt: sortOrder });
            }

            message = "All students";
        } else if (role === "admin") {
            users = await User.find({ role }).sort({ createdAt: sortOrder });
            message = "All admins";
        } else if (role === "teacher") {
            if (department) {
                users = await User.find({ role, department }).sort({ createdAt: sortOrder });
            } else {
                users = await User.find({ role }).sort({ createdAt: sortOrder });
            }

            message = "All teachers";
        } else {
            message = "Invalid role";
            users = null;
        }

        const usersData = sanitizedUserList(users);
        const successMsg = twohundredResponse({
            message,
            data: usersData.length === 0 ? [] : usersData,
            studentsCount: usersData.length,
            accessToken: req.accessToken
        });
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

//api to search for user based on the role
router.post('/searchUser', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { role, query } = req.body;
        const validRoles = ['student', 'admin', 'teacher'];

        if (!validRoles.includes(role)) {
            throw { status: 400, message: resMessages.notFoundMsg }
        }

        const users = await User.find({
            role,
            $or: [
                { username: { $regex: query, $options: 'i' } },
                // { email: { $regex: query, $options: 'i' } },
            ],
        }).sort({ createdAt: "desc" });
        const sanitizedUsers = sanitizedUserList(users);
        const searchResults = sanitizedUsers.length;
        const successResponse = twohundredResponse({ message: "Search results :", data: sanitizedUsers, searchResults })
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

//api to  update a user details by id (based on role)
router.put('/editUser/:id', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { username, email, password, semester, role, department } = req.body;
        const userId = req.params.id;

        if (userId === "undefined") {
            throw { status: 400, message: "User id not found" }
        }

        if (!username && !email && !password && !role && !department) {
            throw { status: 400, message: "Please fill the required fields" }
        }

        if (role === "student") {
            if (!username) {
                throw { status: 400, message: "Username is required" }
            } else if (!password) {
                throw { status: 400, message: "Password is required" }
            } else if (!email) {
                throw { status: 400, message: "Email is required" }
            } else if (!semester) {
                throw { status: 400, message: "Semester is required" }
            } else if (!department) {
                throw { status: 400, message: "Department is required" }
            }
        } else if (role === "teacher") {

            if (!username) {
                throw { status: 400, message: "Username is required" }
            } else if (!password) {
                throw { status: 400, message: "Password is required" }
            } else if (!email) {
                throw { status: 400, message: "Email is required" }
            } else if (!department) {
                throw { status: 400, message: "Department is required" }
            }
        } else if (role === "admin") {
            if (!username) {
                throw { status: 400, message: "Username is required" }
            } else if (!email) {
                throw { status: 400, message: "Email is required" }
            }
        }

        if (department && !deps.includes(department)) {
            throw { status: 400, message: "Please select a valid department" }
        }

        if (semester && !sems.includes(semester)) {
            throw { status: 400, message: "Please select a valid semester" }
        }

        // Check if username or email already exists
        const existingUserByUsername = await User.findOne({
            username,
            role,
            _id: { $ne: userId } // Exclude the requesting user
        });
        const existingByEmail = await User.findOne({
            email,
            role,
            _id: { $ne: userId } // Exclude the requesting user
        });

        if (existingUserByUsername && existingUserByUsername._id.toString() !== userId) {
            throw { status: 400, message: `Email: "${existingByEmail?.username}" is already taken`, description: "Please choose a different username" }
        } else if (existingByEmail && existingByEmail._id.toString() !== userId) {
            throw { status: 400, message: `Email: "${existingByEmail?.email}" is already taken`, description: "Please choose a different email" }
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw { status: 404, message: resMessages.userNotfoundMsg }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        // Update user details based on role
        if (user.role === 'student') {
            user.username = username;
            user.email = email;
            user.password = hashedPassword;
            user.semester = semester;
            user.role = role;
            user.department = department;
            user.lastUpdatedBy = req.user._id
        } else {
            user.username = username;
            user.email = email;
            user.password = hashedPassword;
            user.department = department;
            user.role = role;
            user.lastUpdatedBy = req.user._id
        }
        let updated = true
        // Save updated user
        const updatedUser = await user.save();
        console.log(updatedUser)
        const userData = abstractedUserData(updatedUser, updated);
        const successMessage = twohundredResponse({ message: 'User details updated successfully', data: userData })
        return res.status(200).json(successMessage);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description || ""
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to delete a user by id
router.delete('/deleteUserById/:id', Auth.verifyAdminToken, async (req, res) => {
    try {
        let message
        const userId = req.params.id
        const userExists = await User.findOne({ _id: userId });
        if (!userExists) {
            throw { status: 400, message: resMessages.userNotfoundMsg }
        }

        const role = userExists?.role

        await userExists.deleteOne();

        const deletedUser = abstractedUserData(userExists);
        if (role === "student") {
            message = `Student: "${deletedUser?.username}" deleted successfully`
        } else if (role === "teacher") {
            message = `Teacher: "${deletedUser?.username}" deleted successfully`
        } else if (role === "admin") {
            message = `Admin: "${deletedUser?.username}" deleted successfully`
        }

        const successMessage = twohundredResponse({ message, data: deletedUser })
        return res.status(200).json(successMessage);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})


//api to search letter
router.post('/searchLetter', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { query } = req.body;
        if (validator.isEmpty(query) || validator.matches(query, /[./\[\]{}<>]/)) {
            throw { status: 400, message: "Invalid characters" }
        }

        const letters = await Letter.find({
            $or: [
                { subject: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
        }).sort({ createdAt: "desc" });

        const sanitizedLetters = letters;
        const searchResCount = letters.length
        const message = searchResCount === 0 ? "The requested resource could not be found." : "Search results:"
        const successResponse = twohundredResponse({ message, data: sanitizedLetters, searchResCount });
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

//api to add action by admin
router.post('/addActionsAndComments', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { letterId, actions, comments } = req.body;

        if (validator.matches(actions, /[/\[\]{}<>]/)) {
            throw { status: 400, message: 'Please enter a valid action' };
        }

        if (validator.matches(comments, /[/\[\]{}<>]/)) {
            throw { status: 400, message: 'Please enter a valid comment' };
        }

        const letter = await Letter.findById(letterId);

        if (!letter) {
            throw { status: 404, message: 'Letter not found' };
        }

        let successMessage;

        if (actions !== "") {
            letter.actions = actions;
            successMessage = twohundredResponse({ message: 'Actions added successfully', data: { actions, comments: letter.comments } });
        }

        if (comments !== "") {
            letter.comments = comments;
            successMessage = twohundredResponse({ message: 'Comments added successfully', data: { comments, actions: letter?.actions } });
        }

        if (actions !== "" && comments !== "") {
            successMessage = twohundredResponse({ message: 'Actions & Comments added successfully', data: { actions: letter?.actions, comments: letter?.comments } });
        }

        await letter.save();

        return res.json(successMessage || twohundredResponse({ message: 'No changes made' }));
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to delete comment or actions
router.post("/deleteComments", Auth.verifyAdminToken, async (req, res) => {
    try {
        const { letterId } = req.body;
        if (!letterId) {
            throw { status: 400, message: "Invalid grievance id" }
        }
        const letter = await Letter.findOne({ _id: letterId })
        if (!letter) {
            throw { status: 404, message: "Grievance does not exists" }
        }

        letter.comments = ""
        await letter.save();

        return res.status(200).json(twohundredResponse({ data: { comments: "" }, message: 'Comment deleted successfully' }));
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})


//api to delete actions
router.post("/deleteActions", Auth.verifyAdminToken, async (req, res) => {
    try {
        const { letterId } = req.body;
        if (!letterId) {
            throw { status: 400, message: "Invalid grievance id" }
        }
        const letter = await Letter.findOne({ _id: letterId })
        if (!letter) {
            throw { status: 404, message: "Grievance does not exists" }
        }

        letter.actions = ""
        await letter.save();

        return res.status(200).json(twohundredResponse({ data: { actions: "" }, message: 'Actions deleted successfully' }));
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to update read status of the letter
router.post('/updateReadStatus', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { letterId } = req.body;

        if (letterId === "undefined" || letterId === null) {
            throw { status: 404, message: "Invalid letter id" }
        }

        const letter = await Letter.findOne({ _id: letterId });

        if (!letter) {
            throw { status: 404, message: "Letter does not exists !" }
        }

        if (letter.isRead) {
            throw { status: 200, message: "Letter already read !" }
        }

        letter.isRead = true

        await letter.save();
        return res.json(twohundredResponse({ message: 'Read status updated successfully' }));
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to generate csv fot the grievances
router.post('/generate-csv', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate) {
            throw { status: 400, message: "Start date is required" }
        }
        if (!endDate) {
            throw { status: 400, message: "End date is required" }
        }

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!startDate || !dateFormatRegex.test(startDate)) {
            throw { status: 400, message: "Invalid start date format. It should be in the format 'yyyy-mm-dd'" };
        }

        if (!endDate || !dateFormatRegex.test(endDate)) {
            throw { status: 400, message: "Invalid end date format. It should be in the format 'yyyy-mm-dd'" };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const letters = await Letter.find({ createdAt: { $gte: start, $lte: end } }).populate('from', 'username');

        if (letters.length === 0) {
            throw { status: 400, message: "No grievances in the selected time period" }
        }

        const formattedLetters = letters.map(letter => ({
            from: letter?.from?.username,
            subject: letter?.subject,
            body: letter?.body,
            actions: letter?.actions ? letter?.actions : "No actions taken",
            comments: letter?.comments ? letter?.comments : "No comments added",
            createdAt: formatDate(letter?.createdAt),
        }));

        // Convert letters to CSV
        const csv = json2csv(formattedLetters, { fields: ['from', 'subject', 'body', 'actions', 'comments', 'createdAt'] });

        // Set response headers for CSV download
        res.setHeader('Content-disposition', 'attachment; filename=Grievances.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csv);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to generate pdf fot the grievances
router.post('/generate-pdf', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        console.log(req.body)
        if (!startDate) {
            throw { status: 400, message: "Start date is required" }
        }
        if (!endDate) {
            throw { status: 400, message: "End date is required" }
        }

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!startDate || !dateFormatRegex.test(startDate)) {
            throw { status: 400, message: "Invalid start date format. It should be in the format 'yyyy-mm-dd'" };
        }

        if (!endDate || !dateFormatRegex.test(endDate)) {
            throw { status: 400, message: "Invalid end date format. It should be in the format 'yyyy-mm-dd'" };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        console.log(start, end)
        const letters = await Letter.find({ createdAt: { $gte: start, $lte: end } }).populate('from', 'username');

        if (letters.length === 0) {
            throw { status: 400, message: "No grievances in the selected time period" }
        }

        const formattedLetters = letters.map((letter) => ({
            from: letter?.from?.username,
            subject: letter?.subject,
            body: letter?.body,
            actions: letter?.actions ? letter?.actions : "No actions taken",
            comments: letter?.comments ? letter?.comments : "No comments added",
            createdAt: formatDate(letter.createdAt),
        }));

        const letterCount = formattedLetters?.length

        // Generate PDF
        const fonts = {
            Roboto: {
                normal: path.resolve(__dirname, '../Utils/fonts/Roboto-Regular.ttf'),
                bold: path.resolve(__dirname, '../Utils/fonts/Roboto-Medium.ttf'),
                italics: path.resolve(__dirname, '../Utils/fonts/Roboto-ThinItalic.ttf'),
                bolditalics: path.resolve(__dirname, '../Utils/fonts/Roboto-MediumItalic.ttf'),
            },
        };

        const originalStartDate = startDate
        const reversedStartDate = originalStartDate.split('-').reverse().join('-');
        const originalEndDate = endDate
        const reversedEndDate = originalEndDate.split('-').reverse().join('-');


        const printer = new pdfmake(fonts);

        const pdfContent = {
            content: [
                { text: 'Grievances Report', alignment: 'center', style: 'header', margin: [0, 40, 0, 0] }, // Add margin top
                { text: '\n\n' },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `From: ${reversedStartDate} to ${reversedEndDate}`,
                            style: 'date',
                        },
                        {
                            width: '50%',
                            alignment: 'right',
                            text: `Downloaded by: ${req.user?.username}`, // Replace [username] with the actual username
                            style: 'date',
                        },
                    ],
                },
                { text: '\n' },
                { text: `${letterCount} grievances` },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: [30, 65, 90, 150, 60, 55],
                        margin: [0, 5, 0, 15], // Adjust the table margin
                        body: [
                            [
                                { text: 'Sl no.', style: 'tableHeader' },
                                { text: 'From', style: 'tableHeader' },
                                { text: 'Subject', style: 'tableHeader' },
                                { text: 'Body', style: 'tableHeader' },
                                { text: 'Actions', style: 'tableHeader' },
                                // { text: 'Comments', style: 'tableHeader' },
                                { text: 'Created At', style: 'tableHeader' },
                            ],
                            ...formattedLetters.map((letter, index) => [
                                { text: index + 1, style: 'tableBody' },
                                { text: letter.from, style: 'tableBody' },
                                { text: letter.subject, style: 'tableBody' },
                                { text: letter.body, style: 'tableBody' },
                                { text: letter.actions, style: 'tableBody' },
                                // { text: letter.comments, style: 'tableBody' },
                                { text: letter.createdAt, style: 'tableBody' },
                            ]),
                        ],
                    },
                    style: 'table',
                },
            ],
            styles: {
                header: { fontSize: 12, bold: false },
                tableHeader: { bold: true, fontSize: 11, color: 'black' },
                tableBody: { fontSize: 8, bold: false, font: 'Roboto', color: 'black', margin: [0, 3], width: 'wrap' },
                date: { fontSize: 10, bold: false, font: 'Roboto' },
                table: {
                    margin: [0, 5, 0, 15], // Adjust the table margin
                    fontSize: 8,
                    color: 'black',
                },
                cell: {
                    border: '1px solid gray', // Set the border style for each cell
                },
            },
            footer: function (currentPage, pageCount) {
                return {
                    margin: [30, 10],
                    columns: [
                        {
                            text: 'OBCYDIANS CCET', // Add your application credits here
                            width: 'auto',
                            fontSize: 8,
                            color: 'gray',
                        },
                        {
                            text: `Generated on: ${new Date().toLocaleString()}`, // Add generated date and time
                            width: '*',
                            alignment: 'center',
                            fontSize: 8,
                            color: 'gray',
                        },
                        {
                            text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                            width: 'auto',
                            alignment: 'right',
                            fontSize: 8,
                            color: 'gray',
                        },
                    ],
                };
            },

            defaultStyle: {
                fontSize: 10,
            },
            header: function (currentPage, pageCount, pageSize) {
                // You can customize this based on your logo and positioning
                if (currentPage === 1) {
                    return [
                        {
                            image: path.resolve(__dirname, '../Utils/Images/carmellogo.png'),
                            width: 140,
                            height: 50,
                            alignment: 'center',
                            margin: [0, 10], // Centered at the top
                            pageBreak: 'after', // Add page break after the header (logo)
                        },
                    ];
                } else {
                    return null; // No header on subsequent pages
                }
            },
        };

        const pdfDoc = printer.createPdfKitDocument(pdfContent);
        const chunks = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const buffer = Buffer.concat(chunks);
            res.setHeader('Content-Disposition', 'attachment; filename=Grievances.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(buffer);
        });

        pdfDoc.end();
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
});

//api to change the status of the grievances by admin
router.post('/updateGrievanceStatus', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { letterId, status } = req.body;
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED']
        if (!letterId || letterId === "undefined") {
            throw { status: 400, message: "Invalid grievance id" }
        }
        if (!status) {
            throw { status: 400, message: "Status field is required" }
        }
        if (!validStatuses.includes(status)) {
            throw { status: 400, message: "Invalid status entry", description: "Status should be either APPROVED or REJECTED" }
        }
        const letter = await Letter.findOne({ _id: letterId }).populate('from', '_id username email semester department');
        if (!letter) {
            throw { status: 404, message: "Grievance does not exists" }
        }

        if (letter.status === status) {
            throw { status: 400, message: `Status already in ${status} state` }
        }

        letter.status = status
        const updatedLetter = await letter.save();
        return res.status(200).json(twohundredResponse({ message: `Status updated to ${updatedLetter.status}`, data: { status: updatedLetter.status } }))
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to get user details by id
router.post('/getUserDetailsById', Auth.verifyAdminToken, async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw { status: 400, message: "User Id not found!" }
        }
        if (!userId === "undefined") {
            throw { status: 400, message: "Invalid user id" }
        }
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw { status: 404, message: "User does not exists" }
        }
        const userData = abstractedUserData(user);
        return res.status(200).json(twohundredResponse({ message: "Here's the user data :", data: userData }))
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const description = error.description;
        const errorMessage = customError({ resCode: status, message, description })
        return res.status(status).json(errorMessage);
    }
})

//api to delete a letter
router.delete('/deleteLetterById/:letterId', Auth.verifyAdminToken, async (req, res) => {
    try {
        const letterId = req.params.letterId;
        if (!letterId) {
            throw { status: 400, message: "Letter id not found" }
        }

        if (letterId === "undefined") {
            throw { status: 400, message: "Invalid letter id found" }
        }

        // Find the letter by ID
        const letter = await Letter.findById(letterId).populate('sender');
        if (!letter) {
            throw { status: 404, message: resMessages.notFoundMsg }
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