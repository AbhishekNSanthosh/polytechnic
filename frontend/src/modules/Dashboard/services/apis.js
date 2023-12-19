import axios from "axios";
import { adminApi, backendApiUrl, facultyApi, studentApi } from "../../../utils/helpers";

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
        const response = await axios.get(backendApiUrl + facultyApi.getAllLetters, {
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

export const getSearchResults = async (
    query,
    authToken,
    setLetters,
    setIsApiOnCall,
    toast
) => {
    setIsApiOnCall(true);
    try {
        const response = await axios.post(backendApiUrl + adminApi.searchLetters, {
            query
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        setLetters(response.data.data);
        setIsApiOnCall(false);
    } catch (error) {
        setIsApiOnCall(false);
        toast({
            title: error?.response?.data?.message,
            // description: "Redirecting to Login page",
            status: 'error',
            duration: 3000,
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