import React, { useState } from 'react'
import styles from './CreateGriev.module.css'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const CreateGriev = () => {
    const [subject, setSubject] = useState("");
    const [desc, setDesc] = useState("");

    const navigate = useNavigate();
    const toast = useToast();
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