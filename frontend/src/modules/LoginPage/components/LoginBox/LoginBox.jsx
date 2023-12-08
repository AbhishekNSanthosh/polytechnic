import React from 'react'
import styles from './LoginBox.module.css'

const LoginBox = () => {
    return (
        <div className={styles.LoginBoxContainer}>
            <div className={styles.LoginBoxRow}>
                <span className={styles.LoginNavTitle}>CARMEL</span>
                <span className={styles.LoginNavTitle}>POLYTECHNIC COLLEGE</span>
                <div className={styles.LoginBoxTitleBox}>
                    <span className={styles.LoginNavTitleName}>Admin Login</span>
                </div>
            </div>
            <div className={styles.inputCol}>
                <input type="text" className={styles.loginInput} placeholder='Username' />
                <input type="text" className={styles.loginInput} placeholder='Password' />
                <button className={styles.LoginBoxStudentButton} >Student Login</button>
            </div>
        </div>
    )
}

export default LoginBox