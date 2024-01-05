import React from 'react'
import styles from './Forgot.module.css'
import { collegeImages } from '../../utils/helpers'

const ForgotPassword = () => {
    return (
        <div className={styles.container}>
            <img src={collegeImages.collegelogosvg} alt="" className={styles.logo} />
            <div className={styles.forgotBox}>
                <span className={styles.title}>Forgot your Password ?</span>
                <span className={styles.desc}>Please enter the email address which you'd like your password reset information sent to </span>
                <input placeholder='Email address' type="text" className={styles.inputEmail} />
                <button className={styles.submit}>Request reset link</button>
                <button className={styles.back}>Back to login</button>
            </div>
        </div>
    )
}

export default ForgotPassword