import React from 'react'
import styles from '../ListUser.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";

const UserList = ({ user, index }) => {
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
                <div className={styles.hover}>
                    <MdDeleteOutline title='Delete' className={styles.actionIcon} />
                </div>
            </div>
        </div>
    )
}

export default UserList