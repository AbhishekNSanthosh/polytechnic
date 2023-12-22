import React from 'react'
import styles from './ManageLetter.module.css'
import { Select } from '@chakra-ui/react'
import ManageLetterUserList from './components/ManageLetterUserList'

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
                                    <input type="text" placeholder='Search faculty...' className={styles.search} />
                                </div>
                                <div className={styles.manageTopActions}>
                                    <div className={styles.manageTopActionItem}>
                                        <Select placeholder='Filter Department' style={{
                                            width: '8rem'
                                        }}>
                                            <option value='CE'>CE</option>
                                            <option value='CS'>CS</option>
                                            <option value='ME'>ME</option>
                                            <option value='EEE'>EEE</option>
                                        </Select>
                                    </div>
                                    <div className={styles.manageTopActionItem}>
                                        <button className={styles.actionBtn}>Apply Filter</button>
                                    </div>
                                    <div className={styles.manageTopActionItem}>
                                        <button className={styles.actionBtn}>Remove Filter</button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listContainer}>
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                                <ManageLetterUserList />
                            </div>
                        </div>
                        <div className={styles.verticalLine}></div>
                        <div className={styles.manageItemRight}>
                            <div className={styles.manageItemTitle}>
                                <span className={styles.itemtitle}>Current View Access Permissions :</span>
                            </div>
                            <div className={styles.manageRight}>
                                <ManageLetterUserList list={"list"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageLetter
