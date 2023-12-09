import React, { useState } from 'react'
import styles from './LoginPage.module.css'
import { collegeImages } from '../../utils/helpers'
import LoginNav from './components/LoginNav/LoginNav'
import LoginBox from './components/LoginBox/LoginBox'
import { IoMdArrowBack } from "react-icons/io";

const LoginPage = () => {
    const [loginUser, setLoginUser] = useState("root");

    const handleLoginUser = (data) => {
        setLoginUser(data);
    }
    return (
        <div className={styles.loginContainer}>
            {loginUser !== "root" &&
                <div className={styles.icon} title='Back button'>
                    <IoMdArrowBack onClick={() => {
                        setLoginUser("root");
                    }} className={styles.backIcon} />
                </div>
            }
            <div className={styles.loginWrapper}>
                <div className={styles.loginLeftCol}>
                    <img src={collegeImages.collegelogosvg} alt="" className={styles.loginPageLogo} />
                </div>
                <div className={styles.loginRightCol}>
                    <div className={styles.loginNavWrap}>
                        {loginUser === "root" && <LoginNav handleLoginUser={handleLoginUser} />}
                        {loginUser !== "root" && <LoginBox handleLoginUser={handleLoginUser} user={loginUser}/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage