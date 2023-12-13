import axios from 'axios'
import { backendApiUrl, loginUrls } from '../../../utils/helpers';

export const loginUser = async (
    username,
    password,
    toast,
    navigate,
    url,
    userDetails
) => {
    try {
        const response = await axios.post(backendApiUrl + url, {
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
        const token = response.data?.accessToken
        localStorage.setItem('accessType', response.data?.accessType)
        localStorage.setItem('accessToken', response.data?.accessToken)
        setTimeout(() => {
            navigate('/dashboard')
        }, 1000);
        await axios.get(backendApiUrl + userDetails, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((res) => {
            console.log(res)
            localStorage.setItem('user', JSON.stringify(res.data.data))
        })
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
