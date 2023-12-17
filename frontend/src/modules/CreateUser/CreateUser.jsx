import React from 'react'
import styles from './CreateUser.module.css'

const CreateUser = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.topRow}>
                    <span className={styles.title}>Add Student</span>
                </div>
                <div className={styles.actionBox}>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Username' />
                        </div>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Email' />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Semester' />
                        </div>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Department' />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Password' />
                        </div>
                        <div className={styles.item}>
                           
                        </div>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.cancel}>Cancel</button>
                        <button className={styles.submit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUser