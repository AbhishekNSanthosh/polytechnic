import React, { useEffect, useState } from 'react'
import styles from './DisplayLetter.module.css'
import { useParams } from 'react-router-dom'
import { getLetterDetails } from './services/apis';
const DisplayLetter = () => {
    const [letterData, setLetterData] = useState({});
    const params = useParams();

    useEffect(() => {
        getLetterDetails(params?.id, setLetterData);
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.letterWrap}>
                <div className={styles.letterTopRow}>
                    <span className={styles.title}>Grievance</span>
                </div>
                <div className={styles.letterBox}>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>From:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>Abhishek S</span>
                            <span className={styles.letterDetails}>S3 CSE</span>
                        </div>
                    </div>
                    <div className={styles.letterRow}>
                        <div className={styles.left}>
                            <span className={styles.subtitle}>Date:</span>
                        </div>
                        <div className={styles.right}>
                            <span className={styles.letterDetails}>20 / 12 / 2023</span>
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
                            <span className={styles.letterDetails}>Principal</span>
                        </div>
                    </div>
                    <div className={styles.letterBodyRow}>
                        <div className={styles.content}>
                            <span className={styles.subtitle}>Respected Sir ,</span>
                            <span className={styles.subtitle}>hey</span>
                        </div>
                    </div>
                    <div className={styles.letterBodyRow}>
                        <div className={styles.content}>
                            <span className={styles.subtitle}>with regards ,</span>
                            <span className={styles.subtitle}>Thank you</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayLetter