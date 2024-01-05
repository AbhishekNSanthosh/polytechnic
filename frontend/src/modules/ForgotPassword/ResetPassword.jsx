import React, { useState } from 'react'
import styles from './Forgot.module.css'
import { useNavigate } from 'react-router-dom'
import { collegeImages } from '../../utils/helpers';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const ResetPassword = () => {
    const [showNewPassoword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <img src={collegeImages.collegelogosvg} alt="" className={styles.logo} />
            <div className={styles.forgotBox}>
                <span className={styles.title}>Change password</span>
                <span className={styles.desc}>Enter the new password</span>
                <div className={styles.passwordBox}>
                    <input placeholder='New password*' type={showNewPassoword ? 'text' : 'password'} className={styles.inputEmail} />
                    {!showNewPassoword ? <IoEyeOutline className={styles.eye} onClick={() => {
                        setShowNewPassword(true)
                    }} />
                        :
                        <IoEyeOffOutline className={styles.eye} onClick={() => {
                            setShowNewPassword(false)
                        }} />
                    }
                </div>
                <div className={styles.passwordBox}>
                    <input placeholder='Confirm password*' type={showConfirmPassword ? 'text' : 'password'} className={styles.inputEmail} />
                    {!showConfirmPassword ? <IoEyeOutline className={styles.eye} onClick={() => {
                        setShowConfirmPassword(true)
                    }} />
                        :
                        <IoEyeOffOutline className={styles.eye} onClick={() => {
                            setShowConfirmPassword(false)
                        }} />
                    }
                </div>
                <button className={styles.submit}>Change password</button>
                {/* <button className={styles.back} onClick={() => {
                    navigate('/')
                }}>Back to login</button> */}
            </div>
        </div>
    )
}

export default ResetPassword