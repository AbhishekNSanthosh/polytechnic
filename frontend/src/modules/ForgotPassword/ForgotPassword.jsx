import React, { useState } from 'react'
import styles from './Forgot.module.css'
import { collegeImages } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from './services/apis'
import { useToast } from '@chakra-ui/react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrMsg] = useState("");

    const navigate = useNavigate();
    const toast = useToast();

    const handleForgotPassword = () => {
        forgotPassword(email, toast,setErrMsg);
    }
    return (
        <div className={styles.container}>
            <img src={collegeImages.collegelogosvg} alt="" className={styles.logo} />
            <div className={styles.forgotBox}>
                <span className={styles.title}>Forgot your Password ?</span>
                <span className={styles.desc}>Please enter the email address which you'd like your password reset information sent to </span>
                <input value={email} placeholder='Email address' onChange={(e) => {
                    setEmail(e.target.value)
                }} type="text" className={styles.inputEmail} />
                {errorMsg && <span className={styles.err}>Please enter the email address which you'd like your password reset information sent to </span>}
                <button className={styles.submit} onClick={() => {
                    handleForgotPassword()
                }}>Request reset link</button>
                <button className={styles.back} onClick={() => {
                    navigate('/')
                }}>Back to login</button>
            </div>
        </div>
    )
}

export default ForgotPassword