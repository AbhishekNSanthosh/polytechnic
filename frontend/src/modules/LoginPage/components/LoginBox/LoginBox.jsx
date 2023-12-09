import React from 'react'
import styles from './LoginBox.module.css'

const LoginBox = ({ handleLoginUser, user }) => {
    return (
        <div className={styles.LoginBoxContainer}>
            <div className={styles.LoginBoxRow}>
                <span className={styles.LoginNavTitle}>CARMEL</span>
                <span className={styles.LoginNavTitle}>POLYTECHNIC COLLEGE</span>
                <div className={styles.LoginBoxTitleBox}>
                    <span className={styles.LoginNavTitleName}>
                        {user === "admin" && "Admin Login"}
                        {user === "faculty" && "Faculty Login"}
                        {user === "student" && "Student Login"}
                    </span>
                </div>
            </div>
            <div className={styles.inputCol}>
                <input type="text" required className={styles.loginInput} placeholder='Username' />
                <input type="password" required className={styles.loginInput} placeholder='Password' />
                {user === "admin" && <button className={styles.LoginBoxAdminButton} >Login</button>}
                {user === "faculty" && <button className={styles.LoginBoxFacultyButton} >Login</button>}
                {user === "student" && <button className={styles.LoginBoxStudentButton} >Login</button>}
            </div>
        </div>
    )
}

export default LoginBox