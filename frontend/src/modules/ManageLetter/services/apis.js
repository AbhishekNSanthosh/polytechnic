import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getTeachersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    authToken,
    setTeachers,
    selectedUsers,
    navigate,
    toast
) => {
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
        setTeachers(response?.data?.data);
        selectedUsers(response?.data?.data?.viewAccessids)
        console.log(response)
    } catch (error) {
        console.log(error);
        setTeachers([]);
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
    setTeachers,
    setIsApiOnCall,
    setShowNoResults,
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
        setTeachers(response?.data?.data)
        setIsApiOnCall(false);
        if (response.data.searchResults === 0) {
            setShowNoResults(true);
        } else {
            setShowNoResults(false);
        }
        console.log(response)
    } catch (error) {
        setIsApiOnCall(false);
        setTeachers([]);
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

export const updateAccess = async (
    letterId,
    userIds,
    setSelectedUsers,
    authToken,
    navigate,
    toast
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.updateViewAccess + letterId, {
            userIds
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        setSelectedUsers(response?.data?.data?.viewAccessids)
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

export const getLetterDetailsByAdmin = async (
    letterId,
    setSelectedUsers,
    navigate,
    authToken,
    toast
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getLetterData + letterId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setSelectedUsers(response?.data?.data.viewAccessids)
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