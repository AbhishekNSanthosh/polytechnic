const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../Models/User');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyAdminToken } = require('../libs/Auth');
const { roles, fiveHundredResponse, twohundredResponse, fourNotOneResponse, resMessages, fourNotFourResponse, twoNotOneResponse, fourNotNineResponse, fourHundredResponse, sanitizedUserList, fourNotThreeResponse, abstractedUserData, customError } = require('../Utils/Helpers');
const Letter = require('../Models/Letter');
const moment = require('moment');
const XLSX = require('xlsx');
const multer = require('multer');
const { validationResult } = require('express-validator');


const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

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
        console.log(user)
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
        console.log("test", req.user)
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
            email: savedUser.email,
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
        const { username, password, email, semester, department } = req.body;
        if (validator.isEmpty(username) || validator.matches(username, /[./\[\]{}<>]/)) {
            throw { status: 401, message: resMessages.invalidMsg }
        }

        if (validator.isEmpty(password) || validator.matches(password, /[./\[\]{}<>]/)) {
            throw { status: 401, message: resMessages.invalidMsg }
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
            email,
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
        console.error(error);

        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const errorMessage = customError({ resCode: status, message })
        return res.status(status).json(errorMessage);
    }
});

//api to create  new teacher
router.post('/createNewTeacher', verifyAdminToken, async (req, res) => {
    try {
        const { username, password, department, email } = req.body;
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
            email: email,
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
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to get all letters
router.post('/getAllLetters', verifyAdminToken, async (req, res) => {
    try {
        const { sortOrder } = req.body
        const letters = await Letter.find().sort({ createdAt: sortOrder }).populate('from', 'username email department semester role');
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
        return res.status(200).json(successResponseMsg);
    } catch (error) {
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to get single letter
router.get('/getUserLetterById/:id', verifyAdminToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        const letter = await Letter.findOne({ _id: letterId }).populate('from', 'username email semester department');
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
// router.post('/addViewAccessIds/:letterId', async (req, res) => {
//     const { userIds } = req.body;

//     try {
//         const letterId = req.params.letterId;

//         const letter = await Letter.findById(letterId);

//         if (!letter) {
//             const errorMessage = fourNotFourResponse({ message: resMessages.notFoundMsg });
//             return res.status(404).json(errorMessage);
//         }

//         const users = await User.find({ _id: { $in: userIds }, role: "teacher" });

//         if (users.length !== userIds.length) {
//             const errorMessage = fourNotFourResponse({ message: 'Some users not found' });
//             return res.status(404).json(errorMessage);
//         }

//         // Add each user ID to the viewAccessids array
//         userIds.forEach(userId => {
//             if (!letter.viewAccessids.includes(userId)) {
//                 letter.viewAccessids.push(userId);
//             }
//         });

//         // Save the updated letter
//         const updatedLetter = await letter.save();
//         const updated = {
//             viewAccessids: updatedLetter.viewAccessids
//         }
//         const successResponseMsg = twoNotOneResponse({
//             message: "View access IDs added successfully",
//             data: updated
//         });
//         return res.status(201).json(successResponseMsg);
//     } catch (error) {
//         console.log(error)
//         const errorResponse = fiveHundredResponse();
//         return res.status(500).json(errorResponse);
//     }
// });

router.post('/addViewAccessIds/:letterId', async (req, res) => {
    const { userIds } = req.body;

    try {
        const letterId = req.params.letterId;

        const letter = await Letter.findById(letterId);

        if (!letter) {
            const errorMessage = fourNotFourResponse({ message: resMessages.notFoundMsg });
            return res.status(404).json(errorMessage);
        }

        const users = await User.find({ _id: { $in: userIds }, role: "teacher" });

        if (users.length !== userIds.length) {
            const errorMessage = fourNotFourResponse({ message: 'Some users not found' });
            return res.status(404).json(errorMessage);
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
        console.log(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});


//api to upload bulk user data via xlsx
router.post('/uploadManyStudents', verifyAdminToken, upload.single('file'), async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Validation errors in the request body
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            // No file uploaded
            throw new Error('File not provided');
        }

        // Get the buffer containing the file data
        const fileData = req.file.buffer;

        // Process Excel file (assuming single sheet for simplicity)
        const workbook = XLSX.read(fileData, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            // No sheet found in the Excel file
            throw new Error('No sheet found in the Excel file');
        }

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData || jsonData.length === 0) {
            // No data found in the Excel sheet
            throw new Error('No data found in the Excel sheet');
        }

        // Check if users with the same name and role as "student" already exist
        const existingUsers = await User.find({
            $and: [
                { role: 'student' },
                { username: { $in: jsonData.map(student => student.username) } }
            ]
        });

        if (existingUsers.length > 0) {
            // Respond with error message if usernames are already taken
            const duplicates = existingUsers.map(user => ({
                username: user.username,
                semester: user.semester,
                department: user.department,
            }));

            const errorResponse = fourHundredResponse({
                title: 'Duplicate data found!',
                message: 'Some usernames are already taken. Please choose unique usernames.',
                showModal: true,
                duplicates,
            });

            return res.status(409).json(errorResponse);
        }

        // Hash passwords before inserting students into MongoDB
        const studentsToInsert = await Promise.all(jsonData.map(async (student) => {
            if (!student.username) {
                // Check if username field is missing
                throw new Error(`Username field missing for user: ${student.username}`);
            }
            if (!student.email) {
                // Check if email field is missing
                throw new Error(`Email field missing for user: ${student.username}`);
            }
            if (!student.semester) {
                // Check if semester field is missing
                throw new Error(`Semester field missing for user: ${student.username}`);
            }
            if (!student.department) {
                // Check if department field is missing
                throw new Error(`Department field missing for user: ${student.username}`);
            }
            if (!student.password) {
                // Check if password field is missing
                throw new Error(`Password field missing for user: ${student.username}`);
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
        console.error(error.message);

        if (error.message.includes('File not provided')) {
            // File not provided error
            return res.status(400).json({ message: 'File not provided' });
        }

        if (error.message.includes('No sheet found')) {
            // No sheet found in the Excel file
            return res.status(400).json({ message: 'No sheet found in the Excel file' });
        }

        if (error.message.includes('No data found')) {
            // No data found in the Excel sheet
            return res.status(400).json({ message: 'No data found in the Excel sheet' });
        }

        if (error.message.includes('Password field missing') || error.message.includes('Semester field missing') || error.message.includes('Email field missing') || error.message.includes('Username field missing') || error.message.includes('Department field missing')) {
            // Password field missing for some users
            const errorMessage = fourHundredResponse({ message: error.message })
            return res.status(400).json(errorMessage);
        }

        // Other unexpected errors
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
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
//                 text: `Hello ${student.username}!\n\nYour temporary password is: ${tempPassword}`,
//                 html: `<p>Hello ${student.username}!</p>
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
router.post('/getUserListByRole', verifyAdminToken, async (req, res) => {
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
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})

//api to filter students by sem dep etc
router.post('/getUserListByFilters', verifyAdminToken, async (req, res) => {
    try {
        console.log(req.body)
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
            data: usersData.length === 0 ? null : usersData,
            studentsCount: usersData.length,
            accessToken: req.accessToken
        });

        return res.status(200).json(successMsg);
    } catch (error) {
        console.log(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to search for user based on the role
router.post('/searchUser', verifyAdminToken, async (req, res) => {
    try {
        const { role, query } = req.body;

        const validRoles = ['student', 'admin', 'teacher'];
        if (!validRoles.includes(role)) {
            const errorMessage = fourHundredResponse({ message: resMessages.notFoundMsg })
            return res.status(400).json(errorMessage)
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
        console.log(error)
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to  update a user details by id (based on role)
router.put('/editUser/:id', verifyAdminToken, async (req, res) => {
    try {
        const { username, email, password, semester, role, department } = req.body;
        const userId = req.params.id;
        // Check if username or email already exists
        const existingUserByUsername = await User.findOne({ username });
        const existingByEmail = await User.findOne({ email });
        console.log(existingByEmail)
        console.log(existingUserByUsername)
        if (existingUserByUsername && existingUserByUsername._id.toString() !== userId) {
            const errorMessage = fourHundredResponse({ message: resMessages.userAlreadyExistsMsg })
            return res.status(400).json(errorMessage);
        } else if (existingByEmail && existingByEmail._id.toString() !== userId) {
            const errorMessage = fourHundredResponse({ message: resMessages.emailAlreadyExistsMsg })
            return res.status(400).json(errorMessage);
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            const errorMessage = fourNotFourResponse({ message: resMessages.userNotfoundMsg })
            return res.status(404).json(errorMessage);
        }

        // Update user details based on role
        if (user.role === 'student') {
            user.username = username;
            user.email = email;
            user.password = password;
            user.semester = semester;
            user.role = role;
            user.department = department;
            user.lastUpdatedBy = req.user._id
        } else {
            user.username = username;
            user.email = email;
            user.password = password;
            user.department = department;
            user.role = role;
            user.lastUpdatedBy = req.user._id
        }

        // Save updated user
        const updatedUser = await user.save();
        const userData = abstractedUserData(updatedUser);
        const successMessage = twohundredResponse({ message: 'User details updated successfully', data: userData })
        return res.status(200).json(successMessage);
    } catch (error) {
        console.log(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to delete a user by id
router.delete('/deleteUserById/:id', verifyAdminToken, async (req, res) => {
    try {
        const userId = req.params.id
        const userExists = await User.findOne({ _id: userId });
        if (!userExists) {
            const errorResponse = fourNotFourResponse({ message: resMessages.userNotfoundMsg });
            return res.status(400).json(errorResponse);
        }
        await userExists.deleteOne();
        const deletedUser = abstractedUserData(userExists);
        const successMessage = twohundredResponse({ message: 'User deleted successfully', data: deletedUser })
        return res.status(200).json(successMessage);
    } catch (error) {
        console.log(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
})


//api to search letter
router.post('/searchLetter', verifyAdminToken, async (req, res) => {
    try {
        const { query } = req.body;
        if (validator.isEmpty(query) || validator.matches(query, /[./\[\]{}<>]/)) {
            const errorMessage = fourNotOneResponse({ message: "Invalid characters" });
            return res.status(401).json(errorMessage);
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
        console.log(error);
        const errorResponse = fiveHundredResponse();
        return res.status(500).json(errorResponse);
    }
});

//api to add action by admin
router.post('/addActionsAndComments', verifyAdminToken, async (req, res) => {
    try {
        const { letterId, actions, comments } = req.body;

        if (validator.matches(actions, /[./\[\]{}<>]/)) {
            throw { status: 400, message: 'Please enter a valid action' };
        }

        if (validator.matches(comments, /[./\[\]{}<>]/)) {
            throw { status: 400, message: 'Please enter a valid comment' };
        }

        const letter = await Letter.findById(letterId);

        if (!letter) {
            throw { status: 404, message: 'Letter not found' };
        }

        let successMessage;

        if (actions !== "") {
            letter.actions = actions;
            successMessage = twohundredResponse({ message: 'Actions added successfully', data: { actions } });
        }

        if (comments !== "") {
            letter.comments = comments;
            successMessage = twohundredResponse({ message: 'Comments added successfully', data: { comments } });
        }

        if (actions !== "" && comments !== "") {
            successMessage = twohundredResponse({ message: 'Actions & Comments added successfully', data: { actions, comments } });
        }

        await letter.save();

        return res.json(successMessage || twohundredResponse({ message: 'No changes made' }));
    } catch (error) {
        console.error(error);

        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const errorMessage = customError({ resCode: status, message })
        return res.status(status).json(errorMessage);
    }
});

//api to update read status of the letter
router.post('/updateReadStatus', verifyAdminToken, async (req, res) => {
    try {
        const { letterId } = req.body;
        const letter = await Letter.findOne({ _id: letterId });

        if (!letter) {
            throw { status: 404, message: "Letter does not exists !" }
        }

        if (letter.isRead) {
            throw { status: 400, message: "Letter already read !" }
        }

        letter.isRead = true

        await letter.save();

        return res.json(twohundredResponse({ message: 'Read status updated successfully' }));
    } catch (error) {
        console.error(error);

        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        const errorMessage = customError({ resCode: status, message })
        return res.status(status).json(errorMessage);
    }
})

module.exports = router;