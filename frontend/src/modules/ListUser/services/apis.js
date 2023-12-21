import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getUsersByAdmin = async (
    semester,
    department,
    role,
    authToken,
    setUsers
) => {
    try {
        const response = await axios.post(backendApiUrl + adminApi.getAllUsers, {
            semester,
            department,
            role
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        setUsers(response?.data?.data);
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

export const searchUser = async () => {
    try {
        
    } catch (error) {
        
    }
}