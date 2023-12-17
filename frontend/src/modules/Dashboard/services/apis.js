import axios from "axios";
import { adminApi, backendApiUrl, studentApi } from "../../../utils/helpers";

const authToken = localStorage.getItem('accessToken');

export const getAllLettersForAdmin = async (
    setLetters,
    toast
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
    setLetters,
    toast
) => {
    try {
        const response = await axios.get(backendApiUrl + studentApi.getAllLetters, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        console.log(response.data)
        setLetters(response.data.data)
    } catch (error) {
        if(error.response.data.resCode){

        }
    }
}

export const getAllLettersForTeacher = async (
    setLetters,
    toast
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