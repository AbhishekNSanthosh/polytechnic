import axios from "axios";
import { adminApi, backendApiUrl, studentApi } from "../../../utils/helpers";

// const authToken = localStorage.getItem('accessToken');

export const getAllLettersForAdmin = async (
    setLetters,
    toast,
    navigate,
    authToken
) => {
    console.log(authToken)
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error);
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

export const getAllLettersForStudent = async (
    setLetters,
    toast,
    navigate,
    authToken
) => {
    try {
        const response = await axios.get(backendApiUrl + studentApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error);
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

export const getAllLettersForTeacher = async (
    setLetters,
    toast,
    navigate,
    authToken
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
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