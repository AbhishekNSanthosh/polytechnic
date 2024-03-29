import collegeLogo from '../assets/Logos/carmelpolytechniclogo.svg'
import collegeLogopng from '../assets/Logos/carmelpolylogo.png'
import collegeLogonew from '../assets/Logos/carmellogo.png'
import emptyImage from '../assets/Images/empty.png'

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
    collegeLogonew: collegeLogonew,
    emptyImg:emptyImage
}

export const studentApi = {
    getLetterData: "/api/v2/student/getUserLetterById/",
    getAllLetters: '/api/v2/student/getAllLetters',
    searchLetters: "/api/v2/student/searchLetter",
    createLetter: '/api/v2/student/addLetter',
    deleteLetter: '/api/v2/student/deleteLetterById/',
}

export const teacherApi = {
    getAllLetters: '/api/v2/teacher/getAllLetters',
    createLetter: "/api/v2/teacher/addLetter",
    getLetterData: "/api/v2/teacher/getUserLetterById/",
    searchLetters: "/api/v2/teacher/searchLetter",
    deleteLetter: '/api/v2/teacher/deleteLetterById/',
    getPermittedLetters: "/api/v2/teacher/teacherPermittedLetters",
}

export const adminApi = {
    getAllLetters: '/api/v2/admin/getAllLetters',
    getLetterData: "/api/v2/admin/getUserLetterById/",
    createStudent: "/api/v2/admin/createNewStudent",
    createAdmin: "/api/v2/admin/createNewAdmin",
    createTeacher: "/api/v2/admin/createNewTeacher",
    getAllUsers: "/api/v2/admin/getUserListByFilters",
    searchLetters: "/api/v2/admin/searchLetter",
    searchUsers: "/api/v2/admin/searchUser",
    updateViewAccess: "/api/v2/admin/addViewAccessIds/",
    createBulkStudent: "/api/v2/admin/uploadManyStudents",
    createBulkTeacher: "/api/v2/admin/uploadManyTeacher",
    adminGeneratePDF: "/api/v2/admin/generate-pdf",
    adminGenerateCSV: "/api/v2/admin/generate-csv",
    adminUpdateGrievanceStatus: "/api/v2/admin/updateGrievanceStatus",
    actionAndCommentUpdate: "/api/v2/admin/addActionsAndComments",
    deleteCommentApi: "/api/v2/admin/deleteComments",
    deleteActionApi: "/api/v2/admin/deleteActions",
    updateReadStatus: "/api/v2/admin/updateReadStatus",
    getUserData: "/api/v2/admin/getUserDetailsById",
    editUserData: "/api/v2/admin/editUser/",
    deleteUserApi: "/api/v2/admin/deleteUserById/",
    deleteLetter: '/api/v2/admin/deleteLetterById/',
}

export const publicApi = {
    forgotPasswordApi:'/api/v2/public/forgotPassword',
    resetPasswordApi:'/api/v2/public/resetPassword'
}
