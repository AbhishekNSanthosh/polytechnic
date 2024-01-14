import { adminApi } from '../../../utils/helpers'
import { privateGateway } from '../../../services/apiGateWays';

export const getUsersByAdmin = async (
    semester,
    department,
    role,
    sortOrder,
    setUsers,
    toast,
    setIsLoading
) => {
    setIsLoading(true)
    try {
        const response = await privateGateway.post(adminApi.getAllUsers, {
            semester,
            department,
            sortOrder,
            role
        });
        setUsers(response?.data?.data);
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

export const searchUser = async (
    query,
    role,
    setUsers,
    setIsApiOnCall,
    toast
) => {
    setIsApiOnCall(true);
    try {
        const response = await privateGateway.post(adminApi.searchUsers, {
            query,
            role
        });
        setUsers(response?.data?.data)
        setIsApiOnCall(false);
    } catch (error) {
        setIsApiOnCall(false);
        toast({
            title: error?.response?.data?.message,
            description: error?.response?.data?.description,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
}

//api to delet user
export const deleteUser = async (
    userId,
    setShowConfirm,
    toast,
    getUserList,
    handleDeleteUser
) => {
    try {
        const response = await privateGateway.delete(adminApi.deleteUserApi + userId);
        toast({
            title: response?.data?.message,
            description: response?.data?.description,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        handleDeleteUser(userId);
        setShowConfirm(false);
        setTimeout(() => {
            getUserList(false);
        }, 300);
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