import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'

export const getUsersByAdmin = async (
    authToken
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllUsers, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });

        console.log(response)
    } catch (error) {
        console.log(error)
    }
}