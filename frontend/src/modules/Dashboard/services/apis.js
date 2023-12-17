import axios from "axios";
import { adminApi, backendApiUrl } from "../../../utils/helpers";

const authToken = localStorage.getItem('accessToken');

export const getAllLettersForAdmin = async (
    setLetters
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

export const getAllLettersForStudent = async (
    setLetters
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

export const getAllLettersForTeacher = async (
    setLetters
) => {
    try {
        const response = await axios.get(backendApiUrl + adminApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        console.log(error)
    }
}