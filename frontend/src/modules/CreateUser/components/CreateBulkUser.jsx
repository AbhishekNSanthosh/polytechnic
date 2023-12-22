import React, { useRef, useState } from 'react';
import styles from '../CreateUser.module.css';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'


const CreateBulkUser = () => {
    const [file, setFile] = useState(null);
    const inputRef = useRef();
    const navigate = useNavigate();
    const toast = useToast();

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length === 1) {
            handleFileChange(droppedFiles[0]);
        }
    }

    const handleFileChange = (selectedFile) => {
        // Check if the selected file has the correct extension
        if (selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
        } else {
            // alert('Please select a valid .xlsx file.');
            toast({
                title: 'Please select a valid .xlsx file.',
                // description: "Redirecting to Login page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    console.log(file)

    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.innWrap}>
                    <div className={styles.createTop}>
                        <span className={styles.createTitle}>Create bulk user</span>
                    </div>
                    <div className={styles.uploadBox}>
                        <div
                            className={styles.upload}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!file ?
                                <>
                                    <span className={styles.uploadTxt}>Drag & Drop</span>
                                    <input
                                        type="file"
                                        ref={inputRef}
                                        hidden
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                        accept=".xlsx"
                                    />
                                    <span className={styles.uploadTxt}>or</span>
                                    <button onClick={() => inputRef.current.click()} className={styles.selectBtn}>Select files</button>
                                </>
                                :
                                <span className={styles.uploadTxt}>{file?.name}</span>
                            }
                        </div>
                        <div className={styles.actionBtnRow}>
                            <button className={styles.cancelBtn}>Cancel</button>
                            <button className={styles.uploadBtn}>Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBulkUser;
