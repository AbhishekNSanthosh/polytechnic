import React from 'react'
import styles from './ManageLetter.module.css'
import { Select } from '@chakra-ui/react'

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
                                    <input type="text" placeholder='Search faculty' className={styles.search} />
                                </div>
                                <div className={styles.manageTopActions}>
                                    <div className={styles.manageTopActionItem}>
                                        <Select placeholder='Sort'>
                                            <option value='desc'>Newest on top</option>
                                            <option value='asc'>Oldest on top</option>
                                        </Select>
                                    </div>
                                    <div className={styles.manageTopActionItem}>
                                       <button className={styles.actionBtn}>Apply Filter</button>
                                    </div>
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
