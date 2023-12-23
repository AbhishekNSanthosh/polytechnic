import React, { useRef, useState } from 'react';
import styles from '../CreateUser.module.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { uploadBulkStudentData } from '../services/api';
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
            uploadBulkStudentData(file, authToken, setModalOpen,setDuplicateData, navigate, toast);
        }
    };

    const onClose = () => {
        setModalOpen(false);
    }

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.modalWrap)) {
            onClose();
        }
        console.log(e.target.classList.contains(styles.modalWrap));
    };
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.innWrap}>
                    <div className={styles.createTop}>
                        <span className={styles.createTitle}>Create bulk user</span>
                    </div>
                    <div className={styles.uploadBox}>
                        <div className={styles.upload} onDragOver={handleDragOver} onDrop={handleDrop}>
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
                            <button className={styles.cancelBtn}>Cancel</button>
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
