import React from 'react'
import styles from './Dashboard.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.dashboardTopRow}>
                <div className={styles.dashboardRowLeft}>
                    <div className={styles.searchWrap}>
                        <IoIosSearch className={styles.icon} />
                        <input type="text" className={styles.dashboardRowLeftSearch} placeholder='Search' />
                    </div>
                </div>
                <div className={styles.dashboardRowRight}>
                    <div className={styles.rightItem}>
                        <Select placeholder='Filter Dep wise'>
                            <option value='option1'>CE</option>
                            <option value='option2'>CSE</option>
                            <option value='option3'>ME</option>
                            <option value='option3'>EEE</option>
                        </Select>
                    </div>
                    <div className={styles.rightItem}>
                        <Select placeholder='Sort'>
                            <option value='desc'>Newest on top</option>
                            <option value='asce'>Oldest on top</option>
                        </Select>
                    </div>
                    <div className={styles.rightItem}>
                        <button className={styles.apllyBtn}>Apply filter</button>
                    </div>
                </div>
            </div>
            <div className={styles.dashboardRow}></div>
        </div>
    )
}

export default Dashboard