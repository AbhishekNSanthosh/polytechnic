import { adminApi } from '../../../utils/helpers'
import { privateGateway } from '../../../services/apiGateWays';

export const getTeachersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    setTeachers,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.getAllUsers, {
            semester,
            department,
            sortOrder,
            role
        });
        setTeachers(response?.data?.data);
    } catch (error) {
        setTeachers([]);
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
    }
}

export const searchUser = async (
    query,
    role,
    setTeachers,
    setIsApiOnCall,
    setShowNoResults,
    toast
) => {
    setIsApiOnCall(true);
    try {
        const response = await privateGateway.post(adminApi.searchUsers, {
            query,
            role
        })
        setTeachers(response?.data?.data)
        setIsApiOnCall(false);
        if (response.data.searchResults === 0) {
            setShowNoResults(true);
        } else {
            setShowNoResults(false);
        }
    } catch (error) {
        setIsApiOnCall(false);
        setTeachers([]);
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
    }
}

export const updateAccess = async (
    letterId,
    userIds,
    setSelectedUsers,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.updateViewAccess + letterId, {
            userIds
        });
        setSelectedUsers(response?.data?.data?.viewAccessids)
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
    }
}

export const getLetterDetailsByAdmin = async (
    letterId,
    setSelectedUsers,
    setLetterData,
    toast,
    setIsLoading
) => {
    setIsLoading(true);
    try {

        const response = await privateGateway.get(adminApi.getLetterData + letterId);
        setLetterData(response?.data?.data);
        setSelectedUsers(response?.data?.data.viewAccessids)
        setIsLoading(false)
    } catch (error) {
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
    }
}

export const updateStatusByAdmin = async (
    letterId,
    status,
    setStatus,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.adminUpdateGrievanceStatus, { letterId, status });
        setStatus(response?.data?.data.status);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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

export const updateCommentAndActions = async (
    letterId,
    actions = "",
    comments = "",
    setShowActions,
    setShowComments,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.actionAndCommentUpdate, { letterId, actions, comments });
        setShowActions(response?.data?.data?.actions);
        setShowComments(response?.data?.data?.comments);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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

export const deleteComment = async (
    letterId,
    setShowComments,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.deleteCommentApi, { letterId });
        setShowComments(response?.data?.data?.comments);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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

export const deleteAction = async (
    letterId,
    setShowActions,
    toast
) => {
    try {
        const response = await privateGateway.post(adminApi.deleteActionApi, { letterId });
        setShowActions(response?.data?.data?.actions);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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

export const getLetterDetails = async (
    letterId,
    setShowActions,
    setShowComments,
    toast
) => {
    try {
        const response = await privateGateway.get(adminApi.getLetterData + letterId);
        setShowActions(response?.data?.data?.actions);
        setShowComments(response?.data?.data?.comments);
    } catch (error) {
        toast({
            title: error?.response?.data?.title,
            description: error?.response?.data?.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
        });
    }
}