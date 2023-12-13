import axios from 'axios'
import { backendApiUrl, loginUrls } from '../../../utils/helpers'

export const loginUser = async (
    username,
    password
) => {
    console.log("called")
    try {
        const response = await axios.post(backendApiUrl + loginUrls.login, {
            username,
            password
        })
        localStorage.setItem('accessType', response.data?.accessType)
        localStorage.setItem('accessToken', response.data?.accessToken)
        console.log(response.datak)
        return response
    } catch (error) {
        console.log(error)
    }
}
