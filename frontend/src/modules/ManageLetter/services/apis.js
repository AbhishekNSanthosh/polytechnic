import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getTeachersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    authToken,
    setTeachers,
    // setSelectedUsers,
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
        // setSelectedUsers(response?.data?.data?.viewAccessids)
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
    setLetterData,
    navigate,
    authToken,
    toast
) => {
    console.log("called")
    try {
        const response = await axios.get(backendApiUrl + adminApi.getLetterData + letterId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setLetterData(response?.data?.data);
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

export const updateStatusByAdmin = async (
    letterId,
    status,
    setStatus,
    authToken,
    navigate,
    toast
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.adminUpdateGrievanceStatus, { letterId, status }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setStatus(response?.data?.data.status);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.log(error)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
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

export const updateCommentAndActions = async (
    letterId,
    actions = "",
    comments = "",
    setShowActions,
    setShowComments,
    authToken,
    navigate,
    toast
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.actionAndCommentUpdate, { letterId, actions, comments }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setShowActions(response?.data?.data?.actions);
        setShowComments(response?.data?.data?.comments);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.log(error)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
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

export const deleteComment = async (
    letterId,
    setShowComments,
    authToken,
    navigate,
    toast
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.deleteCommentApi, { letterId }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setShowComments(response?.data?.data?.comments);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.log(error)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
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

export const deleteAction = async (
    letterId,
    setShowActions,
    authToken,
    navigate,
    toast
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.deleteActionApi, { letterId }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response);
        setShowActions(response?.data?.data?.actions);
        toast({
            title: response?.data?.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.log(error)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
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

export const getLetterDetails = async (
    letterId,
    setShowActions,
    setShowComments,
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
        setShowActions(response?.data?.data?.actions);
        setShowComments(response?.data?.data?.comments);
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