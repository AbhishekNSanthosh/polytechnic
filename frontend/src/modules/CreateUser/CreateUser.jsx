import React, { useEffect, useState } from 'react'
import styles from './CreateUser.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { TbUsersPlus } from "react-icons/tb";
import { createAdmin, createFaculty, createStudent, getUserData } from './services/api';
import { useToast } from '@chakra-ui/react'

const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");
    const [userType, setUserType] = useState("")
    const [userId, setUserId] = useState(null);
    const [editPage, setEditPage] = useState(false);

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

    useEffect(() => {
        if (location.pathname.split('/').pop().split('-')[0] === "edit") {
            setEditPage(true)
            setUserType("Edit " + userValue);
            setUserId(location.pathname.split('/')[2])
        } else {
            setEditPage(false)
            setUserType("Add " + userValue)
        }
        console.log('user id :', userId)

        getUserData(userId, setUsername, setPassword, setEmail, setSemester, setDepartment, toast)
    }, [userId]);

    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                {userValue !== "admin" && !editPage &&
                    <button className={styles.bulk} onClick={() => {
                        if (userValue === "student") {
                            navigate('/user-management/create-student/bulk-student')
                        }
                        if (userValue === "teacher") {
                            navigate('/user-management/create-student/bulk-teacher')
                        }
                    }}> <TbUsersPlus />Add bulk users ?</button>
                }
                <div className={styles.topRow}>
                    {/* {userValue === "student" && <span className={styles.title}>Add Student</span>}
                    {userValue === "admin" && <span className={styles.title}>Add Admin</span>}
                    {userValue === "teacher" && <span className={styles.title}>Add teacher</span>} */}
                    <span className={styles.title}>{userType}</span>
                </div>
                <div className={styles.actionBox}>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            <input type="text" value={username} className={styles.txtInput} placeholder='Username*' onChange={(e) => {
                                setUsername(e.target.value);
                            }} />
                        </div>
                        <div className={styles.item}>
                            <input type="text" value={password} className={styles.txtInput} placeholder='Password*' onChange={(e) => {
                                setPassword(e.target.value);
                            }} />

                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" value={email} className={styles.txtInput} placeholder='Email*' onChange={(e) => {
                                setEmail(e.target.value);
                            }} />}
                        </div>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" value={department} className={styles.txtInput} placeholder='Department*' onChange={(e) => {
                                setDepartment(e.target.value);
                            }} />}
                        </div>
                    </div>
                    {userValue === "student" &&
                        <div
                            div className={styles.row}>
                            <div className={styles.item}>
                                <input type="text" value={semester} className={styles.txtInput} placeholder='Semester*' onChange={(e) => {
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