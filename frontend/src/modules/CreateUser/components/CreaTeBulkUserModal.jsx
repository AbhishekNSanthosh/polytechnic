import styles from '../CreateUser.module.css'
import React from 'react'

const CreaTeBulkUserModal = ({ modalOpen, onClose }) => {

    if (!modalOpen) return null;
    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalWrapItem}>
                <div className={styles.modalItem}>
                    <span className={styles.duplicate}>Duplicate data :</span>
                </div>
                <div className={styles.modalItemRow}>
                    <div className={styles.modalLeft}>
                        <span className={styles.duplicate}>1</span>
                    </div>
                    <div className={styles.modalCenter}>
                        <span className={styles.duplicate}>1</span>
                    </div>
                    <div className={styles.modalRight}>
                        <span className={styles.duplicate}>1</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreaTeBulkUserModal