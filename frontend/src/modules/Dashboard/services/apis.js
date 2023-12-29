import axios from "axios";
import { adminApi, backendApiUrl, studentApi, teacherApi } from "../../../utils/helpers";

// const authToken = localStorage.getItem('accessToken');

export const getAllLettersForAdmin = async (
    setLetters,
    sortOrder,
    toast,
    navigate,
    authToken,
) => {
    try {
        const response = await axios.post(
            backendApiUrl + adminApi.getAllLetters,
            { sortOrder },
            {
                headers: { Authorization: "Bearer " + authToken },
            }
        );
        setLetters(response.data.data);
    } catch (error) {
        console.log(error);
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

export const getAllLettersForStudent = async (
    setLetters,
    sortOrder,
    toast,
    navigate,
    authToken
) => {
    try {
        const response = await axios.post(backendApiUrl + studentApi.getAllLetters, {
            sortOrder
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error);
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

export const getAllLettersForTeacher = async (
    setLetters,
    sortOrder,
    toast,
    navigate,
    authToken
) => {
    try {
        console.log("called")
        const response = await axios.post(backendApiUrl + teacherApi.getAllLetters, { sortOrder }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
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

export const getSearchResults = async (
    url,
    query,
    authToken,
    setLetters,
    toast
) => {
    // setIsApiOnCall(true);
    try {
        const response = await axios.post(backendApiUrl + url, {
            query
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        setLetters(response.data.data);
        // setIsApiOnCall(false);
    } catch (error) {
        console.log(error)
        // setIsApiOnCall(false);
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

export const getTeacherPermittedLetters = async (
    sortOrder,
    setLetters,
    authToken,
    navigate,
    toast,

) => {
    try {
        const response = await axios.post(backendApiUrl + teacherApi.getPermittedLetters, {
            sortOrder,
            authToken
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            },

        })
        console.log(response);
        setLetters(response?.data?.data)
    } catch (error) {
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