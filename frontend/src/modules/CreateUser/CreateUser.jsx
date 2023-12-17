import React, { useState } from 'react'
import styles from './CreateUser.module.css'
import { useLocation } from 'react-router-dom'
import { TbUsersPlus } from "react-icons/tb";
const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");
    const location = useLocation();
    const path = location.pathname;
    const lastPart = path.split('/').pop();
    const userValue = lastPart.split('-').pop();


    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.topRow}>
                    <button className={styles.bulk}> <TbUsersPlus />Add bulk users ?</button>
                </div>
                <div className={styles.topRow}>
                    {userValue === "student" && <span className={styles.title}>Add Student</span>}
                    {userValue === "admin" && <span className={styles.title}>Add Admin</span>}
                    {userValue === "faculty" && <span className={styles.title}>Add Faculty</span>}
                </div>
                <div className={styles.actionBox}>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Username*' onChange={(e) => {
                                setUsername(e.target.value);
                            }} />
                        </div>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Email*' onChange={(e) => {
                                setEmail(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Password*' onChange={(e) => {
                                setPassword(e.target.value);
                            }} />
                        </div>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" className={styles.txtInput} placeholder='Department*' onChange={(e) => {
                                setDepartment(e.target.value);
                            }} />}
                        </div>
                    </div>
                    {userValue === "student" &&
                        <div
                            div className={styles.row}>
                            <div className={styles.item}>
                                <div className={styles.item}>
                                    <input type="text" className={styles.txtInput} placeholder='Semester*' onChange={(e) => {
                                        setSemester(e.target.value);
                                    }} />
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