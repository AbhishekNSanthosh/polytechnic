const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoute = require('./Routes/admin.js')
const studentRoute = require('./Routes/student.js')
const teacherRoute = require('./Routes/teacher.js')
const publicRoute = require('./Routes/common.js')
// const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();
// app.use(limiter);
app.enable('trust proxy');
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/v2/admin", adminRoute);
app.use("/api/v2/student", studentRoute);
app.use("/api/v2/teacher", teacherRoute);
app.use("/api/v2/public", publicRoute);

app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/v2/', (req, res) => {
    return res.status(200).json({
        resCode: 200,
        status: "SUCCESS",
        message: "Backend application of Carmel Polytechnic Grievances, developed by Abhishek Santhosh"
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
            console.log("Mongodb error: ", err);
        });
};

app.listen(process.env.PORT, async () => {
    connectDb();
    console.log(`Server started listening at port ${process.env.PORT}`)
})