import axios from 'axios'
import { backendApiUrl, loginUrls } from '../../../utils/helpers';

export const loginUser = async (
    username,
    password,
    toast,
    navigate,
    url,
    userDetails,
    setIsLoading
) => {
    setIsLoading(true);
    try {
        const response = await axios.post(backendApiUrl + url, {
            username,
            password
        })
        toast({
            title: 'Login successfull',
            description: "Redirecting to dashboard",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
        const token = response.data?.accessToken
        localStorage.setItem('accessType', response.data?.accessType)
        localStorage.setItem('accessToken', response.data?.accessToken)
        await axios.get(backendApiUrl + userDetails, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data.data));
            console.log(res)
            setTimeout(() => {
                navigate('/dashboard')
                setIsLoading(false)
            }, 1000);
        })
    } catch (error) {
        setIsLoading(false)
        if (error?.response?.data?.resCode === 403) {
            toast({
                title: error?.response?.data.message,
                description: error?.response?.data?.description,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            toast({
                title: error?.response?.data.message,
                // description: error?.response?.data?.description,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        console.log(error)
    }
}
