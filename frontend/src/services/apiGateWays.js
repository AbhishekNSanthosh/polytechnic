import axios from "axios";
import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const publicGateway = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_API,
    headers: {
        "Content-Type": "application/json"
    }
});

export const privateGateway = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_API,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor
privateGateway.interceptors.request.use(
    function (config) {
        // Check if the browser is online
        if (!navigator.onLine) {
            toast({
                title: "Network Error",
                description: "Please check your internet connection.",
                status: "error",
                duration: 5000,
                isClosable: true
            });

            // Returning a rejected promise will prevent the request from being sent
            return Promise.reject("No internet connection");
        }

        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle network errors
privateGateway.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (!error.response && !error.status) {
            // No response and no error status, indicating a network issue
            toast({
                title: "Network Error",
                description: "Please check your internet connection.",
                status: "error",
                duration: 5000,
                isClosable: true
            });

            return Promise.resolve({
                status: 200,
            });
        } else if (error.response?.data?.resCode === 2215) {
            // Handle specific error code
            toast.closeAll();
            toast({
                title: error.response?.data?.message,
                description: error?.response?.data?.description,
                status: "error",
                duration: 5000,
                isClosable: true
            });

            // Wait for 3 seconds
            setTimeout(() => {
                localStorage.clear();
                window.location.href = "/";
            }, 3000);

            return Promise.resolve({
                status: 200,
            });
        } else {
            return Promise.reject(error);
        }
    }
);
