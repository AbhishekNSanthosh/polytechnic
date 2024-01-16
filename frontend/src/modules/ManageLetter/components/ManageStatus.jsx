import React, { useEffect, useState } from 'react'
import styles from '../ManageLetter.module.css'
import { Select } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { updateStatusByAdmin } from '../services/apis'

const ManageStatus = ({ letterData }) => {
    const [status, setStatus] = useState(letterData?.status ?? 'PENDING');

    useEffect(() => {
        setStatus(letterData?.status ?? 'PENDING')
    }, [letterData])

    const params = useParams();
    const accessType = localStorage.getItem('accessType');
    const toast = useToast();
    const letterId = params.id;

    const handleUpdate = async (e) => {
        if (accessType === "admin") {
            await updateStatusByAdmin(letterId, status, setStatus, toast)
        }
    }

    return (
        <div className={styles.statusContainer}>
            <div className={styles.statusItem}>
                <div className={styles.statusRow}>
                    Update status :
                    <div className={styles.right}>
                        <Select value={status} onChange={(e) => {
                            setStatus(e.target.value)
                        }}>
                            <option value='PENDING'>PENDING</option>
                            <option value='APPROVED'>APPROVED</option>
                            <option value='REJECTED'>REJECTED</option>
                        </Select>
                    </div>
                </div>
                <div className={styles.right}>
                    <button className={styles.statuBtn} onClick={() => {
                        handleUpdate()
                    }}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ManageStatus