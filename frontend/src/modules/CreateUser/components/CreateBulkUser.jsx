import React, { useRef, useState } from 'react';
import styles from '../CreateUser.module.css';
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react';
import { uploadBulkStudentData, uploadBulkTeacherData } from '../services/api';
import CreaTeBulkUserModal from './CreaTeBulkUserModal';

const VALID_FILE_EXTENSION = '.xlsx';

const CreateBulkUser = () => {
    const [file, setFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [duplicateData, setDuplicateData] = useState([]);
    const inputRef = useRef();
    const navigate = useNavigate();
    const toast = useToast();
    const authToken = localStorage.getItem('accessToken');
    const accessType = localStorage.getItem('accessType');

    const location = useLocation();
    const path = location.pathname;
    const lastPart = path.split('/').pop();
    const userValue = lastPart.split('-').pop();

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length === 1) {
            handleFileChange(droppedFiles[0]);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (selectedFile.name.endsWith(VALID_FILE_EXTENSION)) {
            setFile(selectedFile);
        } else {
            toast({
                title: `Please select a valid ${VALID_FILE_EXTENSION} file.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUploadStudents = () => {
        if (authToken !== '' && accessType === 'admin' && file) {
            if (userValue === "student") {
                uploadBulkStudentData(file, authToken, setModalOpen, setDuplicateData, navigate, toast);
            }
            if (userValue === "teacher") {
                uploadBulkTeacherData(file, authToken, setModalOpen, setDuplicateData, navigate, toast);
            }
        }
    };

    const onClose = () => {
        setModalOpen(false);
    }

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.modalWrap)) {
            onClose();
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.innWrap}>
                    <div className={styles.createTop}>
                        {userValue === "student" &&
                            <span className={styles.createTitle}>Create bulk student data</span>
                        }
                        {userValue === "teacher" &&
                            <span className={styles.createTitle}>Create bulk teacher data</span>
                        }
                    </div>
                    <div className={styles.uploadBox}>
                        <div className={styles.upload} style={{
                            backgroundColor:file? "ffe0e0": "#fff" ,
                        }} onDragOver={handleDragOver} onDrop={handleDrop}>
                            {!file ? (
                                <>
                                    <span className={styles.uploadTxt}>Drag & Drop</span>
                                    <input
                                        type="file"
                                        ref={inputRef}
                                        hidden
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                        accept={VALID_FILE_EXTENSION}
                                    />
                                    <span className={styles.uploadTxt}>or</span>
                                    <button onClick={() => inputRef.current.click()} className={styles.selectBtn}>
                                        Select files
                                    </button>
                                </>
                            ) : (
                                <span className={styles.uploadTxt}>{file?.name}</span>
                            )}
                        </div>
                        <div className={styles.actionBtnRow}>
                            <button className={styles.cancelBtn} onClick={() => {
                                navigate('/user-management/create-student')
                            }}>Cancel</button>
                            <button className={styles.uploadBtn} onClick={handleUploadStudents}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {modalOpen &&
                <div className={styles.modalWrap} onClick={(e) => {
                    handleOverlayClick(e);
                }}>
                    <CreaTeBulkUserModal duplicateData={duplicateData} modalOpen={modalOpen} onClose={onClose} />
                </div>
            }
        </div>
    );
};

export default CreateBulkUser;
