import React, { useEffect, useState } from 'react'
import styles from './ManageLetter.module.css'
import { Select } from '@chakra-ui/react'
import ManageLetterUserList from './components/ManageLetterUserList'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getTeachersByAdmin } from './services/apis'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'

const ManageLetter = () => {
    const [applyFilter, setApplyFilter] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("teacher");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedUsers, setSelectedUsers] = useState([]);

    const authToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const toast = useToast();

    const getUserData = () => {
        if (authToken !== "")
            getTeachersByAdmin("", department, role, sortOrder, authToken, setTeachers, navigate, toast)
    }

    useEffect(() => {
        getUserData();
    }, [])

    const handleCheckboxChange = (userId) => {
        const isSelected = selectedUsers.includes(userId);

        if (isSelected) {
            // If user is already selected, remove from the array
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            // If user is not selected, add to the array
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    console.log("select: ", selectedUsers)

    const selectedUserNames = selectedUsers.map((userId) => {
        const teacher = teachers.find((teacher) => teacher._id === userId);
        return teacher ? { username: teacher?.username, department: teacher?.department } : 'Unknown User';
    });

    console.log("selected names: ", selectedUserNames)
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
                                {teachers && teachers.map((teacher, index) => (
                                    <div className={styles.userListContainer}>
                                        <div className={styles.left}>
                                            <div className={styles.leftItem}>
                                                <span className={styles.count}>{index + 1}.</span>
                                            </div>
                                            <div className={styles.leftItem}>
                                                <Checkbox checked={selectedUsers.includes(teacher?._id)} onChange={() => handleCheckboxChange(teacher?._id)} colorScheme='red' isInvalid />
                                            </div>

                                        </div>
                                        <div className={styles.center}>
                                            {teacher?.username}
                                        </div>
                                        <div className={styles.right}>{teacher?.department}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.verticalLine}></div>
                        <div className={styles.manageItemRight}>
                            <div className={styles.manageItemTitle}>
                                <span className={styles.itemtitle}>Current View Access Permissions :</span>
                            </div>
                            <div className={styles.manageRight}>
                                <div className={styles.listContainer}>
                                    {selectedUserNames && selectedUserNames.map((teacher, index) => (
                                        <div className={styles.userListContainer}>
                                            <div className={styles.left}>
                                                <div className={styles.leftItem}>
                                                    <span className={styles.count}>{index + 1}.</span>
                                                </div>
                                            </div>
                                            <div className={styles.center}>
                                                {teacher?.username}
                                            </div>
                                            <div className={styles.right}>{teacher?.department}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageLetter