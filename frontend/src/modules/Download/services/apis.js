import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers';

export const generatePdf = async (
    startDate,
    endDate,
    authToken,
    navigate,
    toast
) => {
    try {
        // Make a request to the API to generate and download the PDF file
        const response = await axios.post(backendApiUrl + adminApi.adminGeneratePDF, { startDate, endDate }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        }, {
            responseType: 'blob', // Specify response type as blob
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'letters.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.log(error);
        toast({
            title: error?.response?.data?.message,
            // description: "Redirecting to Login page",
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
                navigate('/')
            }, 2000);
        }
    }
}