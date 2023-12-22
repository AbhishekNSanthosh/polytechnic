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
                    <div className={styles.manageItemRow}>
                        <div className={styles.manageItemLeft}>
                            <div className={styles.manageItemTop}>
                                <div className={styles.searchBox}>
                                    <input type="text" placeholder='Search faculty' className={styles.search}/>
                                </div>
                                <div className={styles.manageTopActions}>
                                    <input type="text" className={styles.search}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.verticalLine}></div>
                        <div className={styles.manageItemRight}>hi</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageLetter
