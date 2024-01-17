import React, { useEffect, useState } from 'react'
import styles from '../ManageLetter.module.css'
import { useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { deleteAction, deleteComment, getLetterDetails, updateCommentAndActions } from '../services/apis'
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Linkify from 'react-linkify';

const ActionAndComment = () => {
    const [showActions, setShowActions] = useState("");
    const [actions, setActions] = useState(showActions);
    const [showComments, setShowComments] = useState("");
    const [comments, setComments] = useState(showComments);
    const [editAction, setEditAction] = useState(false);
    const [editComment, setEditComment] = useState(false);

    const params = useParams();
    const toast = useToast();
    const letterId = params.id;

    const handleActionsAndComments = async () => {
        await updateCommentAndActions(letterId, actions, comments, setShowActions, setShowComments, toast);
        setEditAction(false);
        setEditComment(false);
    }

    const handleDeleteComment = async () => {
        await deleteComment(letterId, setShowComments, toast);
    }

    const handleDeleteAction = async () => {
        await deleteAction(letterId, setShowActions, toast);
    }

    useEffect(() => {
        getLetterDetails(letterId, setShowActions, setShowComments, toast)
    }, [])

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
                                <span className={styles.ActionAndCommentInfo}>{showComments && (
                                    <Linkify>
                                        {showComments.split('\n').map((paragraph, index) => (
                                            <span key={index}>
                                                {paragraph}
                                                {index !== showComments.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </Linkify>
                                )}</span>
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