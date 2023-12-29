import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

let isRequestInProgress = false;
let count =0
export const getLetterDetails = async (
    letterId,
    setLetterData,
    url,
    navigate,
    authToken,
    toast
) => {
    console.log("called ",count+1)
    try {
        // Check if a request is already in progress
        if (isRequestInProgress) {
            return;
        }

        // Set the flag to indicate that a request is in progress
        isRequestInProgress = true;

        const response = await axios.get(backendApiUrl + url + letterId, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });

        console.log(response.data.data);
        setLetterData(response?.data?.data);
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
    } finally {
        // Reset the flag when the request is complete (either success or error)
        isRequestInProgress = false;
    }
};
