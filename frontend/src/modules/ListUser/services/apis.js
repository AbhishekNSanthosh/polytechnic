import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getUsersByAdmin = async (
    semester,
    department,
    role,
    authToken,
    setUsers
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.getAllUsers, {
            semester,
            department,
            role
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        setUsers(response?.data?.data);
        console.log(response)
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

export const searchUser = async () => {
    try {

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