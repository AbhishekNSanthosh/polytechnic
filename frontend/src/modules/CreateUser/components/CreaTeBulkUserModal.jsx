import styles from '../CreateUser.module.css'
import React from 'react'

const CreaTeBulkUserModal = ({ modalOpen, onClose }) => {

    if (!modalOpen) return null;
    return (
        <div className={styles.modalContainer}>
            hi
        </div>
    )
}

export default CreaTeBulkUserModal