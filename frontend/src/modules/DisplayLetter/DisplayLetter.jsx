import React, { useEffect, useState } from 'react'
import styles from './DisplayLetter.module.css'
import { useParams } from 'react-router-dom'
import { getLetterDetails, updateRead } from './services/apis';
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Loader } from '../../components/Loader';
import Linkify from 'react-linkify';

const DisplayLetter = () => {
    const [letterData, setLetterData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const accessType = localStorage.getItem('accessType');
    const userObj = localStorage.getItem('user');
    const user = JSON.parse(userObj);
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    console.log(user)

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
            updateRead(params?.id, toast)
        }
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
                                    <span className={styles.letterDetails}>
                                        {letterData?.from?.username === user?.username
                                            ? `${letterData?.from?.username} (You)`
                                            : letterData?.from?.username
                                        }
                                    </span>
                                    <span className={styles.letterDetails}>
                                        {letterData?.from?.semester} {letterData?.from?.department}
                                    </span>
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
                                    <span className={styles.subtitle}>Respected Sir,</span>
                                    {letterData?.body && (
                                        <Linkify>
                                            {letterData.body.split('\n').map((paragraph, index) => (
                                                <span key={index}>
                                                    {paragraph}
                                                    {index !== letterData.body.split('\n').length - 1 && <br />}
                                                </span>
                                            ))}
                                        </Linkify>
                                    )}
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
                                                <span className={styles.statusGreen}>🎇{letterData?.status}🥳</span>
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.dataContainerManageRow}>
                                        <div className={styles.actionCol}>
                                            <span className={styles.manageTitle}>Actions:</span>
                                            {letterData?.actions ? <span className={styles.manageTitle}>
                                                {letterData?.actions && (
                                                    <Linkify>
                                                        {letterData?.actions.split('\n').map((paragraph, index) => (
                                                            <span key={index}>
                                                                {paragraph}
                                                                {index !== letterData?.actions.split('\n').length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </Linkify>
                                                )}
                                            </span> : <span className={styles.manageTitle}>No actions taken yet!!!</span>}
                                        </div>
                                        <div className={styles.commentCol}>
                                            <span className={styles.manageTitle}>Comments:</span>
                                            {letterData?.actions ? <span className={styles.manageTitle}>
                                                {letterData?.comments && (
                                                    <Linkify>
                                                        {letterData?.comments.split('\n').map((paragraph, index) => (
                                                            <span key={index}>
                                                                {paragraph}
                                                                {index !== letterData?.comments.split('\n').length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </Linkify>
                                                )}
                                            </span> : <span className={styles.manageTitle}>No comments taken yet!!!</span>}
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