import axios from 'axios'
import { backendApiUrl, loginUrls } from '../../../utils/helpers';

export const loginUser = async (
    username,
    password,
    toast,
    navigate
) => {
    console.log("called")
    try {
        const response = await axios.post(backendApiUrl + loginUrls.login, {
            username,
            password
        })
        toast({
            title: 'Login successfull',
            description: "Redirecting to dashboard",
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
        localStorage.setItem('accessType', response.data?.accessType)
        localStorage.setItem('accessToken', response.data?.accessToken)
        setTimeout(() => {
            navigate('/dashboard')
        }, 1000);
        return response
    } catch (error) {
        toast({
            title: error?.response?.data.message,
            // description: "Redirecting to dashboard",
            status: 'error',
            duration: 3000,
            isClosable: true,
        })
        console.log(error)
    }
}
