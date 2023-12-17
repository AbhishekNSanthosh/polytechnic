import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

const authToken = localStorage.getItem("accessToken")

export const getLetterDetails = async (
    letterId,
    setLetterData,
    url
) => {
    try {
        const response = await axios.get(backendApiUrl+url+letterId,{
            headers:{
                Authorization:"Bearer "+authToken
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}