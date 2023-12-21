import React from 'react'
import styles from './ManageLetter.module.css'

const ManageLetter = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>Manage Letter</span>
                </div>
                <div className={styles.manageRow}>
                    <div className={styles.manageItemTitle}>
                        <span className={styles.itemtitle}>Manage View Access Permission :</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageLetter