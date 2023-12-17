import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

const authToken = localStorage.getItem('accessToken');

export const addLetter = async (
    toast,
    navigate,
    url
) => {
    try {
        const response = await axios.post(backendApiUrl + url, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
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
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }
    }
    }
}