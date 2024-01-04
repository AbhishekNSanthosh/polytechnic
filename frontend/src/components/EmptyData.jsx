import styles from './PolyStyles.module.css'
import React from 'react'
import emptyImg from '../assets/Images/empty.svg'

const EmptyData = () => {
    return (
        <div className={styles.emptyImgBox}>
            <img src={emptyImg} alt="" className={styles.emptyImg} />
            No data found !!!
        </div>
    )
}

export default EmptyData
