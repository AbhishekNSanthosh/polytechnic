import { useEffect, useState } from 'react'
import styles from './LoginBox.module.css'
import { IoMdArrowBack } from "react-icons/io";
import { loginUser } from '../../services/apis';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import { dashboardUrls, loginUrls } from '../../../../utils/helpers';
import { ClipLoader } from 'react-spinners'

// eslint-disable-next-line react/prop-types
const LoginBox = ({ handleLoginUser, user }) => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [passsword, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast()

    const token = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const handleLogin = async () => {
        if (emailOrUsername == "" && passsword === "") {
            toast({
                title: 'Please fill the required fields',
                description: "Email and password is required",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else if (emailOrUsername === "") {
            toast({
                title: 'Email is required',
                // description: "Email is required",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else if (passsword === "") {
            toast({
                title: 'Password is required',
                // description: "Email is required",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            if (user === "admin") {
                await loginUser(
                    emailOrUsername,
                    passsword,
                    toast,
                    navigate,
                    loginUrls.adminLogin,
                    dashboardUrls.getAdminDetials,
                    setIsLoading
                );
            } else if (user === "student") {
                await loginUser(
                    emailOrUsername,
                    passsword, toast,
                    navigate,
                    loginUrls.studentLogin,
                    dashboardUrls.getStudentDetials,
                    setIsLoading
                );
            } else if (user === "teacher") {
                await loginUser(emailOrUsername,
                    passsword,
                    toast,
                    navigate,
                    loginUrls.facultyLogin,
                    dashboardUrls.getFacultyDetials,
                    setIsLoading
                );
            }
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
                {user === "admin" && <button className={styles.LoginBoxAdminButton} onClick={handleLogin} disabled={isLoading}>{isLoading ? "Please wait" : "Login"} {isLoading && <ClipLoader size={22} color="#36d7b7" />}</button>}
                {user === "teacher" && <button className={styles.LoginBoxFacultyButton} onClick={handleLogin} disabled={isLoading}>{isLoading ? "Please wait" : "Login"} {isLoading && <ClipLoader size={22} color="#36d7b7" />}</button>}
                {user === "student" && <button className={styles.LoginBoxStudentButton} onClick={handleLogin} disabled={isLoading}>{isLoading ? "Please wait" : "Login"} {isLoading && <ClipLoader size={22} color="#36d7b7" />}</button>}
                <span className={styles.forgot} onClick={() => {
                    navigate('/forgot-password')
                }}>Forgot password ?</span>
            </div>
        </div>
    )
}

export default LoginBox