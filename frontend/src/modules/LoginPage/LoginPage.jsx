import React, { useState } from 'react'
import styles from './LoginPage.module.css'
import { collegeImages } from '../../utils/helpers'
import LoginNav from './components/LoginNav/LoginNav'
import AdminLogin from './components/AdminLogin/AdminLogin'

const LoginPage = () => {
    const [loginUser, setLoginUser] = useState("root");

    const handleLoginUser = (data) => {
        setLoginUser(data);
    }
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.loginLeftCol}>
                    <img src={collegeImages.collegelogosvg} alt="" className={styles.loginPageLogo} />
                </div>
                <div className={styles.loginRightCol}>
                    <div className={styles.loginNavWrap}>
                        {loginUser === "root" && <LoginNav handleLoginUser={handleLoginUser} />}
                        {loginUser === "admin" && <AdminLogin handleLoginUser={handleLoginUser} />}
                        {/* {loginUser === "teacher" && <AdminLogin handleLoginUser={handleLoginUser} />} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage