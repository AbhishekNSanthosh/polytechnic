import React from 'react'
import styles from './CreateUser.module.css'
import { useLocation } from 'react-router-dom'

const CreateUser = () => {
    const location = useLocation();
    const path = location.pathname;
    const lastPart = path.split('/').pop();
    const userValue = lastPart.split('-').pop();
    console.log(userValue);

    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.topRow}>
                    <button className={styles.bulk}>Add bulk users ?</button>
                </div>
                <div className={styles.topRow}>
                    {userValue === "student" && <span className={styles.title}>Add Student</span>}
                    {userValue === "admin" && <span className={styles.title}>Add Admin</span>}
                    {userValue === "faculty" && <span className={styles.title}>Add Faculty</span>}
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
                            <input type="text" className={styles.txtInput} placeholder='Password' />
                        </div>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" className={styles.txtInput} placeholder='Department' />}
                        </div>
                    </div>
                    {userValue === "student" &&
                        <div
                            div className={styles.row}>
                            <div className={styles.item}>
                                <div className={styles.item}>
                                    <input type="text" className={styles.txtInput} placeholder='Semester' />
                                </div>
                            </div>
                        </div>
                    }
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