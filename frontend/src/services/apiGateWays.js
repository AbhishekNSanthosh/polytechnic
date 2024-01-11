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

// Request Interceptor: Ensure that the URL ends with a trailing slash
// If the URL doesn't terminate with a slash, this interceptor appends one.
// privateGateway.interceptors.request.use(
//     function (config) {
//         if (config.url) {
//             if (!config.url.endsWith("/")) {
//                 config.url += "/";
//             }
//         }
//         return config;
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );

// Add a response interceptor
privateGateway.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        // TODO: if error occurs and status isn't 1000 nothing will happen
        //console.log(error.response,error.response?.data?.statusCode === 1000)
        if (error.response?.data?.resCode === 2215) {
            // publicGatewayAuth
            //console.log("inside",error.response,error.response?.data?.statusCode)
            //console.log("refresh",fetchLocalStorage<AllTokens["refreshToken"]>("refreshToken"))

            //console.log('error_2',error_2);
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
            // return await Promise.reject(error);
            return await Promise.reject(error);

        }
        return Promise.reject(error);
    }
);
