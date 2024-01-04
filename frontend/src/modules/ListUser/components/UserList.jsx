import React, { useState } from 'react'
import styles from '../ListUser.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import deleteImg from '../../../assets/Images/deleteIcon.svg'

const UserList = ({ user, index }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    return (
        <div className={styles.listContainer}>
            <div className={styles.center}>
                <span className={styles.countNo}>{index + 1}.</span>
                <span className={styles.subject}>{user?.username}</span>
                {/* <IoMailUnreadOutline className={styles.read} title='unread' /> */}
            </div>
            <div className={styles.centerCol}>
                <span className={styles.subject}>{user?.department ? user?.department : "Nill"}</span>
                <span className={styles.subject}>{user?.semester ? user?.semester : "Nill"}</span>
            </div>
            <div className={styles.right}>
                <div className={styles.hover}>
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
                        <img src={deleteImg} alt="" className={styles.deleteImage} />
                        <span className={styles.deleteTitle}>Are you sure you want to delete <span className={styles.high}>{user?.username}</span> ?</span>
                        <div className={styles.row}>
                            <button className={styles.cancel} onClick={() => {
                                setShowConfirm(false);
                            }}>Cancel</button>
                            <button className={styles.delete}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserList