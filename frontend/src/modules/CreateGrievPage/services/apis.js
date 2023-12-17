import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

const authToken = localStorage.getItem('accessToken');

export const addLetter = async (
    toast,
    navigate,
    subject,
    desc,
    url
) => {
    try {
        const response = await axios.post(backendApiUrl + url, {
            subject,
            body: desc
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        toast({
            title: 'Grievance created successfully',
            // description: "Redirecting to Login page",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/dashboard')
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