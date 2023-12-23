import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const createFaculty = async (
    username,
    password,
    email,
    department,
    authToken,
    navigate,
    toast,
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.createTeacher, {
            username,
            password,
            email,
            department
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
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
    password,
    email,
    semester,
    department,
    authToken,
    navigate,
    toast,
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
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
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
    password,
    authToken,
    navigate,
    toast,
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.createAdmin, {
            username, password
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
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

export const uploadBulkStudentData = async (
    file,
    authToken,
    setModalOpen,
    navigate,
    toast
) => {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(backendApiUrl + adminApi.createBulkStudent, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data', // Important for handling multipart form data
            },
        })
        console.log(response)
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        navigate('/user-management/list-student');
    } catch (error) {
        console.log(error);
        setModalOpen(error?.response?.data?.showModal)
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
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