import React, { useEffect, useState } from 'react'
import styles from './CreateUser.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { TbUsersPlus } from "react-icons/tb";
import { createAdmin, createFaculty, createStudent, editUserData, getUserData } from './services/api';
import { useToast } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react';

const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("");
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
        if (editPage) {
            await editUserData(userId, username, password, email, semester, department, role, toast, navigate);
        } else {
            if (userValue === "student") {
                await createStudent(username, password, email, semester, department, navigate, toast);
            } else if (userValue === "admin") {
                await createAdmin(username, password, authToken, navigate, toast);
            } if (userValue === "teacher") {
                await createFaculty(username, password, email, department, navigate, toast);
            }
        }
    }

    useEffect(() => {
        if (location.pathname.split('/').pop().split('-')[0] === "edit") {
            setEditPage(true)
            setUserType("Edit " + userValue);
            setUserId(location.pathname.split('/')[2]);
        } else {
            setEditPage(false);
            setUserType("Add " + userValue);
        }

        if (userId !== null) {
            getUserData(userId, setUsername, setPassword, setEmail, setSemester, setDepartment, setRole, toast);
        }
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
                            {editPage && <span className={styles.pass}>Password can't be edited. Please create a new password.</span>}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>
                            {userValue !== "admin" && <input type="text" value={email} className={styles.txtInput} placeholder='Email*' onChange={(e) => {
                                setEmail(e.target.value);
                            }} />}
                        </div>
                        <div className={styles.item}>
                            {userValue !== "admin" &&
                                <Select className={styles.select} placeholder='Department*' value={department} onChange={(e) => {
                                    setDepartment(e.target.value);
                                }}>
                                    <option value='CSE'>CSE</option>
                                    <option value='MECH'>MECH</option>
                                    <option value='CIVIL'>CIVIL</option>
                                    <option value='EEE'>EEE</option>
                                    <option value='AUTOMOBILE'>AUTOMOBILE</option>
                                    <option value='ELECTRONICS'>ELECTRONICS</option>
                                </Select>
                            }
                        </div>
                    </div>
                    {userValue === "student" &&
                        <div className={styles.row}>
                            <Select className={styles.select} placeholder='Semester*' value={semester} onChange={(e) => {
                                setSemester(e.target.value);
                            }}>
                                <option value='S1'>S1</option>
                                <option value='S2'>S2</option>
                                <option value='S3'>S3</option>
                                <option value='S4'>S4</option>
                                <option value='S5'>S5</option>
                                <option value='S6'>S6</option>
                            </Select>
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