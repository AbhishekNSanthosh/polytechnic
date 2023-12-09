import React from 'react'
import styles from './LoginNav.module.css'

const LoginNav = ({ handleLoginUser }) => {
    return (
        <div className={styles.LoginNavContainer}>
            <div className={styles.LoginNavRow}>
                <span className={styles.LoginNavTitle}>CARMEL</span>
                <span className={styles.LoginNavTitle}>POLYTECHNIC COLLEGE</span>
            </div>
            <div className={styles.BtnCol}>
                <button className={styles.LoginNavAdminButton} onClick={() => {
                    handleLoginUser("admin")
                }}>Admin Login</button>
                <button className={styles.LoginNavTeacherButton} onClick={() => {
                    handleLoginUser("faculty")
                }}>Teacher Login</button>
                <button className={styles.LoginNavStudentButton} onClick={() => {
                    handleLoginUser("student")
                }}>Student Login</button>
            </div>
        </div>
    )
}

export default LoginNav