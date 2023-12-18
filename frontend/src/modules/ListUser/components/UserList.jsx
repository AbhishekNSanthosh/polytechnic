import React from 'react'
import styles from '../ListUser.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";

const UserList = ({ user }) => {
    return (
        <div className={styles.listContainer}>
            <div className={styles.left}>
                <span className={styles.countNo}>1.</span>
            </div>
            <div className={styles.center}>
                <span className={styles.subject}>{user?.username}</span>
                <IoMailUnreadOutline className={styles.read} title='unread' />
            </div>
            <div className={styles.right}>
                <MdDeleteOutline title='delete' className={styles.actionIcon} />
            </div>
        </div>
    )
}

export default UserList