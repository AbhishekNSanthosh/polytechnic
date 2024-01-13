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
        const response = await privateGateway.post(url, {
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

//api to delete letter by student
export const deleteLetterByStudent = async (
    letterId,
    toast,
    goForApiCall,
    setShowConfirm,
) => {
    try {
        const response = await privateGateway.delete(studentApi.deleteLetter + letterId);
        goForApiCall(true)
        setShowConfirm(false);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            goForApiCall(false)
        }, 400);
    } catch (error) {
        setShowConfirm(false);
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const deleteLetterByTeacher = async (
    letterId,
    toast,
    setShowConfirm,
    handleDelete
) => {
    try {
        const response = await privateGateway.delete(teacherApi.deleteLetter + letterId);
        goForApiCall(true);
        setShowConfirm(false)
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        handleDelete(letterId)
    } catch (error) {
        setShowConfirm(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const deleteLetterByAdmin = async (
    letterId,
    toast,
    setShowConfirm,
    handleDelete
) => {
    try {
        const response = await privateGateway.delete(adminApi.deleteLetter + letterId);
        setShowConfirm(false)
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        handleDelete(letterId)
    } catch (error) {
        setShowConfirm(false)
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}