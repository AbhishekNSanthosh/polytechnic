import React from 'react'
import styles from '../Dashboard.module.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
const LetterList = () => {
    return (
        <div className={styles.LetterListContainer}>
            <div className={styles.left}>
                <span className={styles.countNo}>1.</span>
            </div>
            <div className={styles.center}>
                <span className={styles.subject}>Lack of drinking water</span>
                <IoMailUnreadOutline className={styles.read} title='unread'/>
            </div>
            <div className={styles.right}>
                <MdDeleteOutline title='delete' className={styles.actionIcon} />
            </div>
        </div>
    )
}

export default LetterList