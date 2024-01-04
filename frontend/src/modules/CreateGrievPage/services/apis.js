import { privateGateway } from '../../../services/apiGateWays';

export const addLetter = async (
    toast,
    navigate,
    subject,
    desc,
    url,
) => {
    try {
        const response = await privateGateway.post(url, {
            subject,
            body: desc
        })
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/dashboard');
            localStorage.setItem('selectedTab', JSON.stringify(1));
        }, 1000)
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