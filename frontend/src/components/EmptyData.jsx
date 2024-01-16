import styles from './PolyStyles.module.css'
import React from 'react'
import { collegeImages } from '../utils/helpers'

const EmptyData = () => {
    return (
        <div className={styles.emptyImgBox}>
            <img src={collegeImages.emptyImg} alt="" className={styles.emptyImg} />
            No data found !!!
        </div>
    )
}

export default EmptyData
