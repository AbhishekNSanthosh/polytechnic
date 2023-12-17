import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

const authToken = localStorage.getItem("accessToken")

export const getLetterDetails = async (
    letterId,
    setLetterData,
    url,
    navigate
) => {
    try {
        const response = await axios.get(backendApiUrl + url + letterId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data.data)
        setLetterData(response?.data?.data)
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.error === "TokenExpiredError") {
            toast({
                title: 'Session Expired',
                description: "Redirecting to Login page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            localStorage.clear();
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }
    }
}