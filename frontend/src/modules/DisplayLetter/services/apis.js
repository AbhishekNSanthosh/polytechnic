import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'
import { privateGateway } from '../../../services/apiGateWays';

export const getLetterDetails = async (
    letterId,
    setLetterData,
    url,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.get(url + letterId);
        setLetterData(response?.data?.data);
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
};

//api to update read status
export const updateRead = async (
    letterId
) => {
    try {
        await privateGateway.post(adminApi.updateReadStatus, { letterId });
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