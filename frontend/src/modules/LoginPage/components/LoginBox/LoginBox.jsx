import React, { useEffect, useState } from 'react'
import styles from './LoginBox.module.css'
import { IoMdArrowBack } from "react-icons/io";
import { loginUser } from '../../services/apis';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import { dashboardUrls, loginUrls } from '../../../../utils/helpers';

const LoginBox = ({ handleLoginUser, user }) => {
    const [emailOrUsername, setEmailOrUsername] = useState(null);
    const [passsword, setPassword] = useState(null); console.log(emailOrUsername, passsword);
    const navigate = useNavigate();
    const toast = useToast()

    const token = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const handleLogin = async () => {
        if (user === "admin") {
            await loginUser(
                emailOrUsername,
                passsword,
                toast,
                navigate,
                loginUrls.adminLogin,
                dashboardUrls.getAdminDetials
            );
        } else if (user === "student") {
            await loginUser(
                emailOrUsername,
                passsword, toast,
                navigate,
                loginUrls.studentLogin,
                dashboardUrls.getStudentDetials
            );
        } else if (user === "teacher") {
            await loginUser(emailOrUsername,
                passsword,
                toast,
                navigate,
                loginUrls.facultyLogin,
                dashboardUrls.getFacultyDetials
            );
        }
    }

    return (
        <div className={styles.LoginBoxContainer}>
            <div className={styles.icon} title='Back button'>
                <IoMdArrowBack onClick={() => {
                    handleLoginUser("root");
                }} className={styles.backIcon} />
            </div>
            <div className={styles.LoginBoxRow}>
                <span className={styles.LoginNavTitle}>CARMEL</span>
                <span className={styles.LoginNavTitle}>POLYTECHNIC COLLEGE</span>
                <div className={styles.LoginBoxTitleBox}>
                    <span className={styles.LoginNavTitleName}>
                        {user === "admin" && "Admin Login"}
                        {user === "teacher" && "teacher Login"}
                        {user === "student" && "Student Login"}
                    </span>
                </div>
            </div>
            <div className={styles.inputCol}>
                <input type="text" required className={styles.loginInput} placeholder='Username' value={emailOrUsername} onChange={(e) => {
                    e.preventDefault();
                    setEmailOrUsername(e.target.value);
                }} />
                <input type="password" required className={styles.loginInput} placeholder='Password' value={passsword} onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                }} />
                {user === "admin" && <button className={styles.LoginBoxAdminButton} onClick={handleLogin}>Login</button>}
                {user === "teacher" && <button className={styles.LoginBoxFacultyButton} onClick={handleLogin}>Login</button>}
                {user === "student" && <button className={styles.LoginBoxStudentButton} onClick={handleLogin}>Login</button>}
                <span className={styles.forgot}>Forgot password ?</span>
            </div>
        </div>
    )
}

export default LoginBox