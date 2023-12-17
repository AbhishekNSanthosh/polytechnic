import axios from 'axios'
import { backendApiUrl } from '../../../utils/helpers'

export const getLetterDetails = async (
    letterId,
    setLetterData
) => {
    try {
        const response = await axios.get(backendApiUrl)
    } catch (error) {
        
    }
}