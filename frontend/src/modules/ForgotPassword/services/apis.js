import { publicGateway } from "../../../services/apiGateWays";
import { publicApi } from "../../../utils/helpers";

export const forgotPassword = async (email, toast, setErrMsg) => {
    try {
        const response = await publicGateway.post(publicApi.forgotPasswordApi, { email });
        console.log(response)
    } catch (error) {
        setErrMsg(error?.response?.data?.message + '. ' + error?.response?.data?.description || "")
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}