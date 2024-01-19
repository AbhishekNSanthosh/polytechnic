import React, { useState } from 'react'
import styles from '../Dashboard.module.css'
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useToast } from '@chakra-ui/react';
import { TiDelete } from "react-icons/ti";
import { deleteLetterByAdmin, deleteLetterByStudent, deleteLetterByTeacher } from '../services/apis';

const LetterList = (props) => {
    const { index, letter, handleDelete } = props;

    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();
    const accessType = localStorage.getItem('accessType');
    const letterSub = letter?.subject.slice(0, 25);
    const letterSubRes = letter?.subject.slice(0, 15);

    const handleDeleteLetter = () => {
        if (accessType === "student") {
            deleteLetterByStudent(letter?._id, toast, setShowConfirm, handleDelete)
        } else if (accessType === "teacher") {
            deleteLetterByTeacher(letter?._id, toast, setShowConfirm, handleDelete)
        } else if (accessType === "admin") {
            deleteLetterByAdmin(letter?._id, toast, setShowConfirm, handleDelete)
        }
    }

    return (
        <div className={styles.LetterListContainer} key={index + 1}>
            <div className={styles.left}>
                <span className={styles.countNo}>{index + 1}.</span>
            </div>
            <div className={styles.center} onClick={() => {
                navigate('/view-letter/' + letter?._id)
            }}>
                <span className={styles.subject}>{letterSub}...</span>
                <span className={styles.subjectRes}>{letterSubRes}...</span>
            </div>
            <div className={styles.centertwo}>
                <span className={styles.date}>{letter?.createdAt?.ago}</span>
                {accessType === "admin" && <div className={styles.hoverIcon}>
                    {!letter?.isRead ?
                        <IoMailUnreadOutline className={styles.unread} title='unread' />
                        :
                        <MdOutlineMarkEmailRead className={styles.read} title='unread' />
                    }
                </div>}
            </div>
            <div className={styles.right}>
                <div className={styles.hoverIcon} onClick={() => {
                    setShowConfirm(true)
                }}>
                    <MdDeleteOutline title='delete' className={styles.actionIcon} />
                </div>
            </div>
            {showConfirm &&
                <div className={styles.deleteConfirm}>
                    <div className={styles.deleteConfirmBox}>
                        <TiDelete className={styles.deleteImage} />
                        {/* <img  loading='lazy' src={deleteImg} alt="" className={styles.deleteImage} /> */}
                        <span className={styles.deleteTitle}>Are you sure you want to delete this letter? </span>
                        <div className={styles.row}>
                            <button className={styles.cancel} onClick={() => {
                                setShowConfirm(false);
                            }}>Cancel</button>
                            <button className={styles.delete} onClick={() => {
                                handleDeleteLetter();
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default LetterList