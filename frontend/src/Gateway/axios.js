// api.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'YOUR_API_BASE_URL',
});

// Set the authorization token from localStorage
const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
};

// Reusable function for making API requests
const apiCall = async (method, url, data = null) => {
    setAuthToken();

    try {
        const response = await instance[method](url, data);
        return response.data;
    } catch (error) {
        // Handle errors (you can customize this based on your needs)
        console.error('API Error:', error);
        throw error;
    }
};

export default apiCall;
