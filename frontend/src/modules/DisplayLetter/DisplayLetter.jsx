import React, { useEffect, useState } from 'react'
import styles from './DisplayLetter.module.css'
import { useParams } from 'react-router-dom'
import { getLetterDetails, updateRead } from './services/apis';
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Loader } from '../../components/Loader';

const DisplayLetter = () => {
    const [letterData, setLetterData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const accessType = localStorage.getItem('accessType');
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    
    useEffect(() => {
        if (accessType === "admin") {
            getLetterDetails(params?.id, setLetterData, adminApi.getLetterData, toast, setIsLoading);
        } else if (accessType === "student") {
            getLetterDetails(params?.id, setLetterData, studentApi.getLetterData, toast, setIsLoading);
        } else if (accessType === "teacher") {
            getLetterDetails(params?.id, setLetterData, teacherApi.getLetterData, toast, setIsLoading);
        }
    }, []);

    useEffect(() => {
        if (accessType === "admin") {
            updateRead(params?.id)
        }
    }, [])



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
                {
                    isLoading ?
                        <div className={styles.loader}>
                            <Loader />
                        </div>
                        :
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
                            {
                                accessType !== "admin" &&
                                <div className={styles.dataContainer}>
                                    <div className={styles.dataContainerRow}>
                                        <div className={styles.statusLeft}>
                                            <span className={styles.statustitle}>Status:</span>
                                        </div>
                                        <div className={styles.statusRight}>
                                            {letterData?.status === "PENDING" &&
                                                <span className={styles.statusYello}>{letterData?.status}⏳</span>
                                            }
                                            {letterData?.status === "REJECTED" &&
                                                <span className={styles.statusRed}><strike>{letterData?.status}</strike></span>
                                            }
                                            {letterData?.status === "APPROVED" &&
                                                <span className={styles.statusGreen}>{letterData?.status}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.dataContainerManageRow}>
                                        <div className={styles.actionCol}>
                                            <span className={styles.manageTitle}>Actions:</span>
                                            <span className={styles.manageTitle}>{letterData?.actions ? letterData?.actions : "No actions taken yet!!!"}</span>
                                        </div>
                                        <div className={styles.commentCol}>
                                            <span className={styles.manageTitle}>Comments:</span>
                                            <span className={styles.manageTitle}>{letterData?.comments ? letterData?.comments : "No comments added yet!!!"}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default DisplayLetter;