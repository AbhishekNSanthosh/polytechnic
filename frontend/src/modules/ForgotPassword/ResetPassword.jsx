import React, { useEffect, useState } from 'react';
import styles from './Forgot.module.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { collegeImages } from '../../utils/helpers';
import { IoEyeOutline } from 'react-icons/io5';
import { IoEyeOffOutline } from 'react-icons/io5';
import { resetPassword } from './services/apis';
import { useToast } from '@chakra-ui/react'

const ResetPassword = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const toast = useToast();
    const authToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (authToken) {
            navigate('/dashboard')
        }
    }, [])
    useEffect(() => {
        setToken(params?.token);
    }, []);

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handlePasswordValidation = () => {
        // Password validation rules
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasDigit = /\d/.test(newPassword);

        if (newPassword.length < minLength) {
            setValidationError('Password must be at least 8 characters long.');
        } else if (!hasUppercase || !hasLowercase || !hasDigit) {
            setValidationError(
                'Password must contain at least one uppercase letter, one lowercase letter, and one digit.'
            );
        } else if (newPassword !== confirmPassword) {
            setValidationError('Passwords do not match.');
        } else if (newPassword.length > minLength) {
            setValidationError('');
        } else {
            setValidationError('');
        }
    };

    const handleSubmit = () => {
        if (newPassword === confirmPassword) {
            resetPassword(token, newPassword, navigate, toast)
        } else {
            setValidationError('Passwords do not match.');
        }
    };

    return (
        <div className={styles.container}>
            <img src={collegeImages.collegelogosvg} alt="" className={styles.logo} />
            <div className={styles.forgotBox}>
                <span className={styles.title}>Change password</span>
                <span className={styles.desc}>Enter the new password</span>
                <div className={styles.passwordBox}>
                    <input
                        placeholder="New password*"
                        type={showNewPassword ? 'text' : 'password'}
                        className={styles.inputEmail}
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        onBlur={handlePasswordValidation}
                    />
                    {!showNewPassword ? (
                        <IoEyeOutline
                            className={styles.eye}
                            onClick={() => {
                                setShowNewPassword(true);
                            }}
                        />
                    ) : (
                        <IoEyeOffOutline
                            className={styles.eye}
                            onClick={() => {
                                setShowNewPassword(false);
                            }}
                        />
                    )}
                </div>
                <div className={styles.passwordBox}>
                    <input
                        placeholder="Confirm password*"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={styles.inputEmail}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        onBlur={handlePasswordValidation}
                    />
                    {!showConfirmPassword ? (
                        <IoEyeOutline
                            className={styles.eye}
                            onClick={() => {
                                setShowConfirmPassword(true);
                            }}
                        />
                    ) : (
                        <IoEyeOffOutline
                            className={styles.eye}
                            onClick={() => {
                                setShowConfirmPassword(false);
                            }}
                        />
                    )}
                </div>
                {validationError && (
                    <div className={styles.validationError}>{validationError}</div>
                )}
                <button className={styles.submit} onClick={handleSubmit}>
                    Change password
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
