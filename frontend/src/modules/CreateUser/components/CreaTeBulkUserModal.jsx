import styles from '../CreateUser.module.css'
import React from 'react'

const CreaTeBulkUserModal = ({ modalOpen, onClose, duplicateData }) => {

    if (!modalOpen) return null;
    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalWrapItem}>
                <div className={styles.modalItem}>
                    <span className={styles.duplicateTitle}>Duplicate data :</span>
                </div>
                {duplicateData && duplicateData.map((duplicate, index) => (
                    <div className={styles.modalItemRow} key={index}>
                        <div className={styles.modalLeft}>
                            <span className={styles.duplicate}>{index + 1}.</span>
                        </div>
                        <div className={styles.modalCenter}>
                            <span className={styles.duplicate}>{duplicate?.username}</span>
                        </div>
                        <div className={styles.modalRight}>
                            <span className={styles.duplicate}>{duplicate?.department}</span>
                            <span className={styles.duplicate}>{duplicate?.semester}</span>
                        </div>
                    </div>
                ))}
                <div className={styles.modalItem}>
                    <span className={styles.duplicateInfo}>Note: Please remove the above data and try again !!!</span>
                </div>
                <div className={styles.modalItem} >
                    <button className={styles.closeBtn} onClick={() => {
                        onClose(false)
                    }}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default CreaTeBulkUserModal