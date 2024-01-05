import React, { useEffect, useState } from 'react'
import styles from './LoginPage.module.css'
import { collegeImages } from '../../utils/helpers'
import LoginNav from './components/LoginNav/LoginNav'
import LoginBox from './components/LoginBox/LoginBox'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [loginUser, setLoginUser] = useState("root");
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard');
        }
    }, [])

    const handleLoginUser = (data) => {
        setLoginUser(data);
    }
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.loginLeftCol}>
                    <img src={collegeImages.collegeLogopng} alt="carmel polytechnic logo" className={styles.loginPageLogo} />
                </div>
                <div className={styles.loginRightCol}>
                    <div className={styles.loginNavWrap}>
                        {loginUser === "root" && <LoginNav handleLoginUser={handleLoginUser} />}
                        {loginUser !== "root" && <LoginBox handleLoginUser={handleLoginUser} user={loginUser} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage