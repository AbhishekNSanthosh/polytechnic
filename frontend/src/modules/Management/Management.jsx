import React from 'react'
import styles from './Management.module.css'
import { MdGroupAdd } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
const Management = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.actionRow}>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/list-student')
                    }}>
                        <MdGroups className={styles.icon} />
                        List all students
                    </div>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/list-teacher')
                    }}>
                        <MdGroups className={styles.icon} />
                        List all faculties
                    </div>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/list-admin')
                    }}>
                        <MdGroups className={styles.icon} />
                        List all admins
                    </div>
                </div>
                <div className={styles.actionRow}>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/create-student')
                    }}>
                        <MdGroupAdd className={styles.icon} />
                        Add new student
                    </div>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/create-teacher')
                    }}>
                        <MdGroupAdd className={styles.icon} />
                        Add new teacher
                    </div>
                    <div className={styles.actions} onClick={() => {
                        navigate('/user-management/create-admin')
                    }}>
                        <MdGroupAdd className={styles.icon} />
                        Add new admin
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Management