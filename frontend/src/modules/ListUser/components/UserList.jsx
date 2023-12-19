import React from 'react'
import styles from '../ListUser.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";

const UserList = ({ user, index }) => {
    return (
        <div className={styles.listContainer}>
            <div className={styles.left}>
                <span className={styles.countNo}>{index + 1}.</span>
            </div>
            <div className={styles.center}>
                <span className={styles.subject}>{user?.username}</span>
                <span className={styles.subject}>{user?.semester}</span>
                {/* <IoMailUnreadOutline className={styles.read} title='unread' /> */}
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