import React from 'react'
import styles from './Management.module.css'
import { MdGroupAdd } from "react-icons/md";
import { MdGroups } from "react-icons/md";

const Management = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.actionRow}>
                    <div className={styles.actions}>
                        <MdGroups className={styles.icon} />
                        List all students
                    </div>
                    <div className={styles.actions}>
                        <MdGroups className={styles.icon} />
                        List all faculties
                    </div>
                    <div className={styles.actions}>
                        <MdGroups className={styles.icon} />
                        List all admins
                    </div>
                </div>
                <div className={styles.actionRow}>
                    <div className={styles.actions}>
                        <MdGroupAdd className={styles.icon} />
                        Add new student
                    </div>
                    <div className={styles.actions}>
                        <MdGroupAdd className={styles.icon} />
                        Add new faculty
                    </div>
                    <div className={styles.actions}>
                        <MdGroupAdd className={styles.icon} />
                        Add new admin
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Management