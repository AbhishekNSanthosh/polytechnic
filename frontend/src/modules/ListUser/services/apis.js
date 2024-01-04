import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getUsersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    authToken,
    setUsers,
    navigate,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await axios.post(backendApiUrl + adminApi.getAllUsers, {
            semester,
            department,
            sortOrder,
            role
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        setUsers(response?.data?.data);
        console.log(response)
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
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

export const searchUser = async (
    query,
    role,
    authToken,
    setUsers,
    setIsApiOnCall,
    navigate,
    toast
) => {
    console.log("first")
    setIsApiOnCall(true);
    try {
        const response = await axios.post(backendApiUrl + adminApi.searchUsers, {
            query,
            role
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        setUsers(response?.data?.data)
        setIsApiOnCall(false);
        console.log(response)
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

//api to delet user
export const deleteUser = async (
    userId,
    authToken,
    setShowConfirm,
    navigate,
    toast,
    getUserList
) => {
    try {
        const response = await axios.delete(backendApiUrl + adminApi.deleteUserApi + userId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
        toast({
            title: response?.data?.message,
            // description: "Redirecting to Login page",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setShowConfirm(false);
        getUserList(true);
        setTimeout(() => {
            getUserList(false);
        }, 300);
    } catch (error) {
        console.log(error)
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