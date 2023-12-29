import React, { useEffect, useState } from 'react'
import styles from './DisplayLetter.module.css'
import { useParams } from 'react-router-dom'
import { getLetterDetails } from './services/apis';
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';
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
        const abortController = new AbortController();
        const { signal } = abortController;
    
        if (accessType === "admin") {
            getLetterDetails(params?.id, setLetterData, adminApi.getLetterData, navigate, authToken, toast, { signal });
        } else if (accessType === "student") {
            getLetterDetails(params?.id, setLetterData, studentApi.getLetterData, navigate, authToken, toast, { signal });
        } else if (accessType === "teacher") {
            getLetterDetails(params?.id, setLetterData, teacherApi.getLetterData, navigate, authToken, toast, { signal });
        }
    
        return () => {
            abortController.abort();
        };
    }, []);
    

    return (
        <div className={styles.container}>
            <div className={styles.letterWrap}>
                {accessType === "admin" &&
                    <div className={styles.letterTopBtn}>
                        <button className={styles.manageBtn}
                            onClick={() => {
                                if (params?.id !== "undefined") {
                                    navigate(`/view-letter/${letterData?._id}/manage`);
                                }
                            }}
                        >Manage</button>
                    </div>
                }
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
                            <span className={styles.letterDetails}>{letterData?.createdAt?.date.slice(0, 11)}</span>
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
                            <span className={styles.subtitleName}>{letterData?.from?.username}</span>
                            <span className={styles.subtitle}>Thank you</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayLetter;