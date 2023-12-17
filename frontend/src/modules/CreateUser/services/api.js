import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const createFaculty = async (
    username,
    email,
    password,
    department,
    navigate,
    toast,
    authToken
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.createTeacher, {
            username, email,
            department, password
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
        toast({
            title: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
        if (error?.response?.data?.error === "TokenExpiredError") {
            toast({
                title: 'Session Expired',
                description: "Redirecting to Login page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            localStorage.clear();
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }
    }
}

export const createStudent = async (
    username,
    email,
    password,
    department,
    semester,
    navigate,
    toast,
    authToken
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.createStudent, {
            username, email,
            department, semester, password
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
        toast({
            title: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
        if (error?.response?.data?.error === "TokenExpiredError") {
            toast({
                title: 'Session Expired',
                description: "Redirecting to Login page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            localStorage.clear();
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }
    }
}

export const createAdmin = async (
    username,
    email,
    password,
    navigate,
    toast,
    authToken
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.createAdmin, {
            username, email,
            department, semester, password
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
        toast({
            title: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
        if (error?.response?.data?.error === "TokenExpiredError") {
            toast({
                title: 'Session Expired',
                description: "Redirecting to Login page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            localStorage.clear();
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }
    }
}