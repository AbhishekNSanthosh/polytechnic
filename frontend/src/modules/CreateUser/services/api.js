import axios from 'axios'
import { adminApi, backendApiUrl } from '../../../utils/helpers'
import { privateGateway } from '../../../services/apiGateWays';

export const createFaculty = async (
    username,
    password,
    email,
    department,
    navigate,
    toast,
) => {
    try {
        const response = await privateGateway.post(adminApi.createTeacher, {
            username,
            password,
            email,
            department
        });
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
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

export const createStudent = async (
    username,
    password,
    email,
    semester,
    department,
    navigate,
    toast,
) => {
    try {
        const response = await privateGateway.post(adminApi.createStudent, {
            username, email,
            department, semester, password
        });
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
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

export const createAdmin = async (
    username,
    password,
    navigate,
    toast,
) => {
    try {
        const response = await privateGateway.post(backendApiUrl + adminApi.createAdmin, {
            username, password
        });
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setTimeout(() => {
            navigate('/user-management');
        }, 1000)
    } catch (error) {
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const uploadBulkStudentData = async (
    file,
    authToken,
    setModalOpen,
    setDuplicateData,
    navigate,
    toast
) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(backendApiUrl + adminApi.createBulkStudent, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data', // Important for handling multipart form data
            },
        })
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate('/user-management/list-student');
    } catch (error) {
        if (error?.response?.data?.showModal) {
            setModalOpen(error?.response?.data?.showModal);
            setDuplicateData(error?.response?.data?.duplicates)
        }
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const uploadBulkTeacherData = async (
    file,
    authToken,
    setModalOpen,
    setDuplicateData,
    navigate,
    toast
) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(adminApi.createBulkTeacher, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data', // Important for handling multipart form data
            },
        })
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate('/user-management/list-teacher');
    } catch (error) {
        if (error?.response?.data?.showModal) {
            setModalOpen(error?.response?.data?.showModal);
            setDuplicateData(error?.response?.data?.duplicates)
        }
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

export const getUserData = async (
    userId,
    setUsername,
    setPassword,
    setEmail,
    setSemester,
    setDepartment,
    setRole,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.getUserData, {
            userId
        })
        setUsername(response?.data?.data?.username);
        setPassword(response?.data?.data?.password);
        setEmail(response?.data?.data?.email);
        setSemester(response?.data?.data?.semester);
        setDepartment(response?.data?.data?.department);
        setRole(response?.data?.data?.role);
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

//api to edit userdata
export const editUserData = async (
    userId,
    username,
    password,
    email,
    semester,
    department,
    role,
    toast,
    navigate
) => {
    try {
        const response = await privateGateway.put(adminApi.editUserData + userId, {
            username,
            password,
            email,
            semester,
            department,
            role
        })
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate(`/user-management/list-${role}`)
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