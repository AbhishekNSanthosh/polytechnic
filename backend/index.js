const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoute = require('./Routes/admin.js')
const studentRoute = require('./Routes/student.js')
const teacherRoute = require('./Routes/teacher.js')
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60000, // 1 second
    max: 1, // 1 request per second
    message: 'Rate limit exceeded. Please try again later.',
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/admin", adminRoute,limiter);
app.use("/api/v1/student", studentRoute,limiter);
app.use("/api/v1/teacher", teacherRoute,limiter);

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