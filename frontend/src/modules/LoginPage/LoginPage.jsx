import React from 'react'
import styles from './LoginPage.module.css'
import { collegeImages } from '../../utils/helpers'
import LoginNav from './components/LoginNav/LoginNav'

const LoginPage = () => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.loginLeftCol}>
                    <img src={collegeImages.collegelogosvg} alt="" className={styles.loginPageLogo} />
                </div>
                <div className={styles.loginRightCol}>
                    <LoginNav />
                </div>
            </div>
        </div>
    )
}

export default LoginPage