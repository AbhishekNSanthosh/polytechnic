import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getTeachersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    authToken,
    setTeachers,
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