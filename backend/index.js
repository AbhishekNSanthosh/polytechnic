const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoute = require('./Routes/admin.js')
const studentRoute = require('./Routes/student.js')
const teacherRoute = require('./Routes/teacher.js')
const rateLimit = require('express-rate-limit');
const rateLimitError = (req, res) => {
    res.status(429).json({
        error: 'Too many requests. Your account is locked for 5 minutes.',
    });
};

const limiter = rateLimit({
    windowMs: 2 * 1000, // 2 seconds
    max: 3, // 3 attempts
    handler: rateLimitError, // Custom error response
});

dotenv.config();
const app = express();
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/v2/admin", adminRoute, limiter);
app.use("/api/v2/student", studentRoute, limiter);
app.use("/api/v2/teacher", teacherRoute, limiter);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "htttp://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/v2/', limiter, (req, res) => {
    return res.status(200).json({
        resCode: 200,
        status: "SUCCESS",
        message: "Backend application of carmel polytechnic grievances, developed by Abhishek Santhosh"
    })
})

const connectDb = () => {
    mongoose
        .connect(
            process.env.MONGO_URL)
        .then((res) => {
            console.log("MONGODB CONNECTED SUCCESSFULLY !!!");
        })
        .catch((err) => {
            console.log("Mongodb error : ", err);
        });
};

app.listen(process.env.PORT, async () => {
    connectDb();
    console.log(`Server started listening at port ${process.env.PORT}`)
})