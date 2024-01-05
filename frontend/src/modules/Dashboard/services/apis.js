import axios from "axios";
import { adminApi, studentApi, teacherApi } from "../../../utils/helpers";
import { privateGateway } from "../../../services/apiGateWays";

export const getAllLettersForAdmin = async (
    setLetters,
    sortOrder,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.post(adminApi.getAllLetters, { sortOrder });
        setLetters(response.data.data);
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const getAllLettersForStudent = async (
    setLetters,
    sortOrder,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.post(studentApi.getAllLetters, {
            sortOrder
        });
        setLetters(response.data.data)
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const getAllLettersForTeacher = async (
    setLetters,
    sortOrder,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.post(teacherApi.getAllLetters, { sortOrder });
        setLetters(response.data.data)
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const getSearchResults = async (
    url,
    query,
    setLetters,
    toast
) => {
    try {
        const response = await axios.post(url, {
            query
        });
        setLetters(response.data.data);
    } catch (error) {
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const getTeacherPermittedLetters = async (
    sortOrder,
    setLetters,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.post(teacherApi.getPermittedLetters, {
            sortOrder
        });
        setLetters(response?.data?.data);
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}