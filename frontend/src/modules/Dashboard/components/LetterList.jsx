import React from 'react'
import styles from '../Dashboard.module.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
const LetterList = (props) => {
    const {index,letter} = props
    return (
        <div className={styles.LetterListContainer} key={index+1}>
            <div className={styles.left}>
                <span className={styles.countNo}>{index+1}.</span>
            </div>
            <div className={styles.center}>
                <span className={styles.subject}>{letter?.subject}</span>
                <IoMailUnreadOutline className={styles.read} title='unread'/>
            </div>
            <div className={styles.right}>
                <MdDeleteOutline title='delete' className={styles.actionIcon} />
            </div>
        </div>
    )
}

export default LetterList