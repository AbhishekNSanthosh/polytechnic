import { privateGateway, publicGateway } from "../../../services/apiGateWays";
import { publicApi } from "../../../utils/helpers";
// import axios from 'axios'/

export const forgotPassword = async (email, toast, setErrMsg, setSuccessMsg) => {
    setErrMsg("")
    setSuccessMsg("")
    try {
        const response = await privateGateway.post(publicApi.forgotPasswordApi, { email });
        console.log(response)
        setSuccessMsg(response?.data?.message + ' ' + response?.data?.description);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        setErrMsg(error?.response?.data?.message + error?.response?.data?.description || "")
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const resetPassword = async (token, newPassword, navigate, toast) => {
    try {
        const response = await publicGateway.post(publicApi.resetPasswordApi, { token, newPassword })
        console.log(response);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate('/')
    } catch (error) {
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}