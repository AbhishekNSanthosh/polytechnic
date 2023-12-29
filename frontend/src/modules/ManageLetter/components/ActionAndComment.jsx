import React, { useEffect, useState } from 'react'
import styles from '../ManageLetter.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getLetterDetails, getLetterDetailsByAdmin, updateCommentAndActions } from '../services/apis'
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const ActionAndComment = () => {
    const [showActions, setShowActions] = useState("");
    const [actions, setActions] = useState(showActions);
    const [showComments, setShowComments] = useState("");
    const [comments, setComments] = useState(showComments);
    const [editAction, setEditAction] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [isDeleteActionCall, setIsDeleteActionCall] = useState(false);
    const [isDeleteCommentCall, setIsDeleteCommentCall] = useState(false);

    const params = useParams();
    const authToken = localStorage.getItem("accessToken");
    const accessType = localStorage.getItem('accessType');
    const navigate = useNavigate();
    const toast = useToast();
    const letterId = params.id;

    const handleActionsAndComments = async () => {
        await updateCommentAndActions(letterId, actions, comments, setShowActions, setShowComments, isDeleteActionCall, isDeleteCommentCall, authToken, navigate, toast);
        setEditAction(false);
        setEditComment(false);
    }

    const handleDeleteComment = async () => {
        await updateCommentAndActions(letterId, actions, comments, setShowActions, setShowComments, isDeleteActionCall, true, authToken, navigate, toast);
        setIsDeleteCommentCall(false);
    }

    const handleDeleteAction = async () => {
        await updateCommentAndActions(letterId, actions, comments, setShowActions, setShowComments, true, isDeleteCommentCall, authToken, navigate, toast);
        setIsDeleteActionCall(false);
    }

    useEffect(() => {
        getLetterDetails(letterId, setShowActions, setShowComments, navigate, authToken, toast,)
    }, [handleActionsAndComments])

    return (
        <div className={styles.ActionAndCommentContainer}>
            <div className={styles.ActionAndCommentLeft}>
                <div className={styles.ActionAndCommentRow}>
                    <span className={styles.ActionAndCommentTitle}>Actions:</span>
                </div>
                {showActions &&
                    <div className={styles.ActionAndCommentRow}>
                        <div className={styles.defaultActions}>
                            <div className={styles.defaultActionLeft}>
                                <span className={styles.ActionAndCommentInfo}>{showActions}</span>
                            </div>
                            <div className={styles.defaultActionRight}>
                                <div className={styles.iconBox} onClick={() => {
                                    setEditAction(!editAction)
                                }}>
                                    <FaRegEdit className={styles.actionIcon} />
                                </div>
                                <div className={styles.iconBox} onClick={() => {
                                    handleDeleteAction()
                                }}>
                                    <MdOutlineDelete className={styles.actionIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {editAction || showActions === "" ?
                    <div className={styles.ActionAndCommentRow}>
                        <textarea onChange={(e) => {
                            setActions(e.target.value)
                        }} placeholder='Add some actions' className={styles.txtArea} name="" id="" cols="30" rows="10"></textarea>
                    </div>
                    :
                    <></>
                }
                {editAction || showActions === "" ?
                    <div className={styles.ActionAndCommentRow}>
                        <button onClick={() => {
                            handleActionsAndComments()
                        }} className={styles.manageBtn}>Add Actions</button>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className={styles.ActionAndCommentRight}>
                <div className={styles.ActionAndCommentRow}>
                    <span className={styles.ActionAndCommentTitle}>Comments:</span>
                </div>
                {showComments &&
                    <div className={styles.ActionAndCommentRow}>
                        <div className={styles.defaultActions}>
                            <div className={styles.defaultActionLeft}>
                                <span className={styles.ActionAndCommentInfo}>{showComments}</span>
                            </div>
                            <div className={styles.defaultActionRight}>
                                <div className={styles.iconBox} onClick={() => {
                                    setEditComment(!editComment)
                                }}>
                                    <FaRegEdit className={styles.actionIcon} />
                                </div>
                                <div className={styles.iconBox} onClick={() => {
                                    handleDeleteComment();
                                }}>
                                    <MdOutlineDelete className={styles.actionIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {editComment || showComments === "" ?
                    <div className={styles.ActionAndCommentRow}>
                        <textarea onChange={(e) => {
                            setComments(e.target.value)
                        }} placeholder='Add some comments' className={styles.txtArea} name="" id="" cols="30" rows="10"></textarea>
                    </div>
                    :
                    <></>
                }
                {editComment || showComments === "" ?
                    <div className={styles.ActionAndCommentRow}>
                        <button onClick={() => {
                            handleActionsAndComments()
                        }} className={styles.manageBtn}>Add Comments</button>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default ActionAndComment