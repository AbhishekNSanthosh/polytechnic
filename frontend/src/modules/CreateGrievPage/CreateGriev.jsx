import React from 'react'
import styles from './CreateGriev.module.css'

const CreateGriev = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.topRow}>
                    <span className={styles.title}>Create Grievance</span>
                </div>
                <div className={styles.grievBox}>
                    <div className={styles.grievBoxRow}>
                        <input type="text" className="" />
                    </div>
                    <div className={styles.grievBoxRow}>
                        <input type="text" className="" />
                    </div>
                    <div className={styles.grievBoxRow}>
                        <button className=""></button>
                        <button className=""></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGriev