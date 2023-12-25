import React, { useState } from 'react'
import styles from './CreateUser.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { TbUsersPlus } from "react-icons/tb";
import { createAdmin, createFaculty, createStudent } from './services/api';
import { useToast } from '@chakra-ui/react'

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
    const authToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async () => {
        if (userValue === "student") {
            await createStudent(username, password, email, semester, department, authToken, navigate, toast)
        } else if (userValue === "admin") {
            await createAdmin(username, password, authToken, navigate, toast)
        } if (userValue === "teacher") {
            await createFaculty(username, password, email, department, authToken, navigate, toast)
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <button className={styles.bulk} onClick={() => {
                    navigate('/user-management/create-student/bulk')
                }}> <TbUsersPlus />Add bulk users ?</button>
                <div className={styles.topRow}>
                    {userValue === "student" && <span className={styles.title}>Add Student</span>}
                    {userValue === "admin" && <span className={styles.title}>Add Admin</span>}
                    {userValue === "teacher" && <span className={styles.title}>Add teacher</span>}
                </div>
                <div className={styles.actionBox}>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Username*' onChange={(e) => {
                                setUsername(e.target.value);
                            }} />
                        </div>
                        <div className={styles.item}>
                            <input type="text" className={styles.txtInput} placeholder='Password*' onChange={(e) => {
                                setPassword(e.target.value);
                            }} />

                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" className={styles.txtInput} placeholder='Email*' onChange={(e) => {
                                setEmail(e.target.value);
                            }} />}
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
                                <input type="text" className={styles.txtInput} placeholder='Semester*' onChange={(e) => {
                                    setSemester(e.target.value);
                                }} />
                            </div>
                            <div className={styles.item}>

                            </div>
                        </div>
                    }
                    <div className={styles.row}>
                        <button className={styles.submit} onClick={() => {
                            handleSubmit();
                        }}>Submit</button>
                        <button className={styles.cancel} onClick={() => {
                            navigate('/user-management')
                        }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUser