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
                        <input type="text" className={styles.subject} placeholder='Subject' />
                    </div>
                    <div className={styles.grievBoxRow}>
                        <textarea type="text" className={styles.desc} placeholder='Description' />
                    </div>
                    <div className={styles.grievBtnRow}>
                        <button className={styles.cancel}>Cancel</button>
                        <button className={styles.save}>Save as draft</button>
                        <button className={styles.submit}>Submit</button>
                    </div>
                    <div className={styles.grievPreRow}>
                        <button className={styles.preview}>Preview</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGriev