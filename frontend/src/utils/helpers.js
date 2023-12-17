import collegeLogo from '../assets/Logos/carmelpolytechniclogo.svg'
import collegeLogopng from '../assets/Logos/carmelpolylogo.png'
import collegeLogonew from '../assets/Logos/carmellogo.png'
export const backendApiUrl = import.meta.env.VITE_APP_BACKEND_API
// Add more URLs as needed

export const loginUrls = {
    adminLogin: "/api/v2/admin/adminLogin",
    studentLogin: "/api/v2/student/studentLogin",
    facultyLogin: "/api/v2/teacher/teacherLogin",
}

export const dashboardUrls = {
    getAdminDetials: "/api/v2/admin/getUserDetails",
    getStudentDetials: "/api/v2/student/getUserDetails",
    getFacultyDetials: "/api/v2/teacher/getUserDetails",
}

export const collegeImages = {
    collegelogosvg: collegeLogo,
    collegeLogopng: collegeLogopng,
    collegeLogonew: collegeLogonew
}

export const studentApi = {
    getLetterData:"/api/v2/student/getUserLetterById/"
}

export const facultyApi = {
    getLetterData:"/api/v2/teacher/getUserLetterById/"
}

export const adminApi = {
    getAllLetters: '/api/v2/admin/getAllLetters',
    getLetterData:"/api/v2/admin/getUserLetterById/"
}