import React, { useEffect, useState } from 'react'
import styles from './CreateGriev.module.css'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { addStudentLetter, addTeacherLetter } from './services/apis'
import { studentApi, teacherApi } from '../../utils/helpers'

const CreateGriev = () => {
    const [subject, setSubject] = useState("");
    const [desc, setDesc] = useState("");

    let studentUrl, teacherUrl
    const accessType = localStorage.getItem('accessType');
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        studentUrl = studentApi.createLetter
        teacherUrl = teacherApi.createLetter
    }, [])


    const handleSubmit = async () => {
        if (accessType === "student") {
            await addStudentLetter(toast, navigate, subject, desc, studentUrl);
        } else if (accessType === "teacher") {
            await addTeacherLetter(toast, navigate, subject, desc, teacherUrl);
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.topRow}>
                    <span className={styles.title}>Create Grievance</span>
                </div>
                <div className={styles.grievBox}>
                    <div className={styles.grievBoxRow}>
                        <input type="text" className={styles.subject} placeholder='Subject' onChange={(e) => {
                            setSubject(e.target.value);
                        }} />
                    </div>
                    <div className={styles.grievBoxRow}>
                        <textarea type="text" className={styles.desc} placeholder='Description' onChange={(e) => {
                            setDesc(e.target.value);
                        }} />
                    </div>
                    {/* <div className={styles.grievPreRow}>
                        <button className={styles.preview}>Preview</button>
                    </div> */}
                    <div className={styles.grievBtnRow}>
                        {/* <button className={styles.save}>Save as draft</button> */}
                        <button className={styles.submit} onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>Submit</button>
                        <button className={styles.cancel} onClick={() => {
                            navigate('/dashboard')
                        }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGriev