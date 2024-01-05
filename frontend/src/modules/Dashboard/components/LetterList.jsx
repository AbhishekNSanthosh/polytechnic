import React from 'react'
import styles from '../Dashboard.module.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdOutlineMarkEmailRead } from "react-icons/md";
// import { deleteUser } from '../services/apis';
import { TiDelete } from "react-icons/ti";

const LetterList = (props) => {
    const [showConfirm, setShowConfirm] = useState(false);


    const { index, letter } = props;
    const navigate = useNavigate();
    const accessType = localStorage.getItem('accessType')

    const letterSub = letter?.subject.slice(0, 25);
    const letterSubRes = letter?.subject.slice(0, 15);
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
                <div className={styles.hoverIcon}>
                    <MdDeleteOutline title='delete' className={styles.actionIcon} />
                </div>
            </div>
            {showConfirm &&
                <div className={styles.deleteConfirm}>
                    <div className={styles.deleteConfirmBox}>
                        <TiDelete className={styles.deleteImage} />
                        {/* <img src={deleteImg} alt="" className={styles.deleteImage} /> */}
                        <span className={styles.deleteTitle}>Are you sure you want to delete the user: "<span className={styles.high}>{user?.username}</span>" ?</span>
                        <div className={styles.row}>
                            <button className={styles.cancel} onClick={() => {
                                setShowConfirm(false);
                            }}>Cancel</button>
                            <button className={styles.delete} onClick={() => {
                                // handleDeleteUser();
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default LetterList