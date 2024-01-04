import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getLetterDetails = async (
    letterId,
    setLetterData,
    url,
    navigate,
    authToken,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await axios.get(backendApiUrl + url + letterId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });

        console.log(response.data.data);
        setLetterData(response?.data?.data);
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        console.log(error);
        toast({
            title: error?.response?.data?.message,
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
                navigate('/');
            }, 2000);
        }
    }
};

//api to update read status
export const updateRead = async (
    letterId,
    authToken
) => {
    try {
        const response = axios.post(backendApiUrl + adminApi.updateReadStatus, { letterId }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
        toast({
            title: error?.response?.data?.message,
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
                navigate('/');
            }, 2000);
        }
    }
}