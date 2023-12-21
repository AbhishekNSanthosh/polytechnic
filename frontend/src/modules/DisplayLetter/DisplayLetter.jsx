import React, { useEffect, useState } from 'react'
import styles from './DisplayLetter.module.css'
import { useParams } from 'react-router-dom'
import { getLetterDetails } from './services/apis';
import { adminApi, facultyApi, studentApi } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const DisplayLetter = () => {
    const [letterData, setLetterData] = useState({});
    const accessType = localStorage.getItem('accessType');
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const authToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (accessType === "admin") {
            getLetterDetails(params?.id, setLetterData, adminApi.getLetterData, navigate, authToken, toast);
        } else if (accessType === "student") {
            getLetterDetails(params?.id, setLetterData, studentApi.getLetterData, navigate, authToken, toast);
        } else if (accessType === "teacher") {
            getLetterDetails(params?.id, setLetterData, facultyApi.getLetterData, navigate, authToken, toast);
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.letterWrap}>
                <div className={styles.letterTopBtn}>
                    <button className={styles.manageBtn}>Manage</button>
                </div>
                <div className={styles.letterTopRow}>
                    <span className={styles.title}>Grievance</span>
                </div>
                <div className={styles.letterBox}>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>From:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>{letterData?.from?.username}</span>
                            <span className={styles.letterDetails}>{letterData?.from?.semester} {letterData?.from?.department}</span>
                        </div>
                    </div>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>Date:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>{letterData?.createdAt?.date}</span>
                        </div>
                    </div>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>To:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>Principal</span>
                            <span className={styles.letterDetails}>Carmel Polytechnic College</span>
                        </div>
                    </div>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>Subject:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>{letterData?.subject}</span>
                        </div>
                    </div>
                    <div className={styles.letterBodyRow}>
                        <div className={styles.content}>
                            <span className={styles.subtitle}>Respected Sir ,</span>
                            <span className={styles.subtitle}>{letterData?.body}</span>
                        </div>
                    </div>
                    <div className={styles.letterBodyRow}>
                        <div className={styles.content}>
                            <span className={styles.subtitle}>with regards ,</span>
                            <span className={styles.subtitle}>{letterData?.from?.username}</span>
                            <span className={styles.subtitle}>Thank you</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayLetter;