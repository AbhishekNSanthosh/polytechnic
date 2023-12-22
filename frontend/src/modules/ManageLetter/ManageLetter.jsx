import React, { useState } from 'react'
import styles from './ManageLetter.module.css'
import { Select } from '@chakra-ui/react'
import ManageLetterUserList from './components/ManageLetterUserList'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const ManageLetter = () => {
    const [applyFilter, setApplyFilter] = useState(false);
    const [teachers, setTeacher] = useState([]);
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("teacher");
    const [sortOrder,setSortOrder] = useState("desc")

    const authToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const toast = useToast();

    const getUserData = () => {
        if (authToken !== "")
            getUsersByAdmin("", department, role, sortOrder, authToken, setUsers, navigate, toast)
    }
}
return (
    <div className={styles.container}>
        <div className={styles.wrap}>
            <div className={styles.titleRow}>
                <span className={styles.title}>Manage Letter</span>
            </div>
            <div className={styles.manageRow}>
                <div className={styles.manageItemTitle}>
                    <span className={styles.itemtitle}>Manage View Access Permission :</span>
                </div>
                <div className={styles.manageItemRow}>
                    <div className={styles.manageItemLeft}>
                        <div className={styles.manageItemTop}>
                            <div className={styles.searchBox}>
                                <input type="text" placeholder='Search faculty...' className={styles.search} />
                            </div>
                            <div className={styles.manageTopActions}>
                                <div className={styles.manageTopActionItem}>
                                    <Select placeholder='Filter Department' onChange={(e) => {
                                        setDepartment(e.target.value);
                                    }} style={{
                                        width: '8rem'
                                    }}>
                                        <option value='CE'>CE</option>
                                        <option value='CS'>CS</option>
                                        <option value='ME'>ME</option>
                                        <option value='EEE'>EEE</option>
                                    </Select>
                                </div>
                                <div className={styles.manageTopActionItem}>
                                    <button className={styles.actionBtn} onClick={() => {
                                        setApplyFilter(true);
                                    }}>Apply Filter</button>
                                </div>
                                <div className={styles.manageTopActionItem}>
                                    <button className={styles.actionBtn} onClick={() => {
                                        setApplyFilter(false);
                                    }}>Remove Filter</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.listContainer}>
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                            <ManageLetterUserList />
                        </div>
                    </div>
                    <div className={styles.verticalLine}></div>
                    <div className={styles.manageItemRight}>
                        <div className={styles.manageItemTitle}>
                            <span className={styles.itemtitle}>Current View Access Permissions :</span>
                        </div>
                        <div className={styles.manageRight}>
                            <ManageLetterUserList list={"list"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)


export default ManageLetter
