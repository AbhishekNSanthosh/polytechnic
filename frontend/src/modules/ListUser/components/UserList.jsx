import React, { useState } from 'react'
import styles from '../ListUser.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import deleteImg from '../../../assets/Images/deleteIcon.svg'
import { deleteUser } from '../services/apis';
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { TiDelete } from "react-icons/ti";

const UserList = ({ user, index,handleDeleteUser }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
    const path = location.pathname;
    const lastPart = path.split('/').pop();
    const userValue = lastPart.split('-').pop();
    const authToken = localStorage.getItem('accessToken');

    const handleDeleteUser = () => {
        deleteUser(user?._id, setShowConfirm, toast,handleDeleteUser)
    }
    return (
        <div className={styles.listContainer}>
            <div className={styles.center}>
                <span className={styles.countNo}>{index + 1}.</span>
                <span className={styles.subject}>{user?.username}</span>
            </div>
            <div className={styles.centerCol}>
                <span className={styles.subject}>{user?.department && user?.department}</span>
                <span className={styles.subject}>{user?.semester && user?.semester}</span>
            </div>
            <div className={styles.right}>
                <div className={styles.hover} onClick={() => {
                    if (userValue === "student") {
                        navigate(`/user-management/${user?._id}/edit-student`)
                    } else if (userValue === "admin") {
                        navigate(`/user-management/${user?._id}/edit-admin`)
                    } else if (userValue === "teacher") {
                        navigate(`/user-management/${user?._id}/edit-teacher`)
                    }
                }}>
                    <FiEdit title='Edit' className={styles.edit} />
                </div>
                <div className={styles.hover} onClick={() => {
                    setShowConfirm(true);
                }}>
                    <MdDeleteOutline title='Delete' className={styles.actionIcon} />
                </div>
            </div>
            {showConfirm &&
                <div className={styles.deleteConfirm}>
                    <div className={styles.deleteConfirmBox}>
                        <TiDelete className={styles.deleteImage}/>
                        <span className={styles.deleteTitle}>Are you sure you want to delete the user: "<span className={styles.high}>{user?.username}</span>" ?</span>
                        <div className={styles.row}>
                            <button className={styles.cancel} onClick={() => {
                                setShowConfirm(false);
                            }}>Cancel</button>
                            <button className={styles.delete} onClick={() => {
                                handleDeleteUser();
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserList