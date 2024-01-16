import React, { useEffect, useState } from 'react'
import styles from './ManageLetter.module.css'
import { Select } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getLetterDetailsByAdmin, getTeachersByAdmin, searchUser, updateAccess } from './services/apis'
import { Checkbox } from '@chakra-ui/react'
import ManageStatus from './components/ManageStatus'
import ActionAndComment from './components/ActionAndComment'
import { Loader } from '../../components/Loader'

const ManageLetter = () => {
    const [applyFilter, setApplyFilter] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("teacher");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [apiOnCall, setApiOnCall] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);
    const [letterData, setLetterData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const authToken = localStorage.getItem("accessToken");
    const accessType = localStorage.getItem('accessType');
    const navigate = useNavigate();
    const toast = useToast();
    const letterId = params.id;

    const getUserData = () => {
        if (authToken !== "") {
            getTeachersByAdmin("", department, role, sortOrder, setTeachers, toast);
        }
    }

    useEffect(() => {
        if (accessType === "admin" && authToken !== "") {
            getLetterDetailsByAdmin(letterId, setSelectedUsers, setLetterData, toast, setIsLoading);
        }
    }, [])

    useEffect(() => {
        getUserData();
    }, [applyFilter])

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

    const handleSearch = async (e) => {
        setQuery(e.target.value);
        if (authToken !== "" && accessType === "admin") {
            if (query !== "" && query !== " ") {
                await searchUser(query, "teacher", setTeachers, setApiOnCall, setShowNoResults, toast)
            } else {
                getUserData();
            }
        }
    }

    const users = selectedUsers

    const selectedUserNames = users.map((userId) => {
        const teacher = teachers.find((teacher) => teacher._id === userId);
        return teacher ? { username: teacher?.username, department: teacher?.department } : 'Unknown User';
    });

    const handleViewAccess = () => {
        if (authToken !== "" && accessType === "admin") {
            updateAccess(letterId, selectedUsers, setSelectedUsers, toast);
        }
    }

    if (accessType !== "admin") {
        return null
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>Manage Letter</span>
                </div>
                {isLoading ?
                    <div className={styles.loader}>
                        <Loader />
                    </div> :
                    <>
                        <ManageStatus letterData={letterData} />
                        <div className={styles.manageRow}>
                            <div className={styles.manageItemTitle}>
                                <span className={styles.itemtitle}>Manage View Access Permission :</span>
                            </div>
                            <div className={styles.manageItemRow}>
                                <div className={styles.manageItemLeft}>
                                    <div className={styles.manageItemTop}>
                                        <div className={styles.searchBox}>
                                            <input onChange={(e) => {
                                                handleSearch(e)
                                            }} type="text" placeholder='Search faculty...' className={styles.search} />
                                        </div>
                                        <div className={styles.manageTopActions}>
                                            <div className={styles.manageTopActionItem}>
                                                <Select placeholder='Filter Department' value={department} onChange={(e) => {
                                                    setDepartment(e.target.value);
                                                }} style={{
                                                    width: '8rem'
                                                }}>
                                                    <option value='CIVIL'>CIVIL</option>
                                                    <option value='CSE'>CSE</option>
                                                    <option value='MECH'>MECH</option>
                                                    <option value='EEE'>EEE</option>
                                                    <option value='ELECTRONICS'>ELECTRONICS</option>
                                                    <option value='AUTOMOBILE'>AUTOMOBILE</option>
                                                </Select>
                                            </div>
                                            <div className={styles.manageTopActionItem}>
                                                <button className={styles.actionBtn} onClick={() => {
                                                    setApplyFilter(true);
                                                }}>Apply Filter</button>
                                            </div>
                                            {applyFilter &&
                                                <div className={styles.manageTopActionItem}>
                                                    <button className={styles.actionBtn} onClick={() => {
                                                        setDepartment("");
                                                        setApplyFilter(false);
                                                    }}>Remove Filter</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {showNoResults ?
                                        <div className={styles.listContainerSpl}>
                                            <span className={styles.none}>No search results !!!</span>
                                        </div>
                                        :
                                        <div className={styles.listTopContainer}>
                                            <div className={styles.listContainer}>
                                                {teachers && teachers.map((teacher, index) => (
                                                    <div className={styles.userListContainer} key={index}>
                                                        <div className={styles.left}>
                                                            <div className={styles.leftItem}>
                                                                <span className={styles.count}>{index + 1}.</span>
                                                            </div>
                                                            <div className={styles.leftItem}>
                                                                <Checkbox isChecked={selectedUsers.some(selected => selected === teacher?._id)} onChange={() => handleCheckboxChange(teacher?._id)} colorScheme='red' isInvalid />
                                                            </div>

                                                        </div>
                                                        <div className={styles.center}>
                                                            <span className={styles.listUsername}> {teacher?.username}</span>
                                                        </div>
                                                        <div className={styles.right}>{teacher?.department}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.btnRow}>
                                                <button className={styles.submitBtn} onClick={() => {
                                                    handleViewAccess();
                                                }}>Update view access permission</button>
                                                <button className={styles.cancelBtn} onClick={() => {
                                                    navigate('/view-letter/' + letterId)
                                                }}>Cancel</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className={styles.verticalLine}></div>
                                <div className={styles.manageItemRight}>
                                    <div className={styles.manageItemTitle}>
                                        <span className={styles.itemtitle}>Current View Access Permissions :</span>
                                    </div>
                                    <div className={styles.manageRight}>
                                        {selectedUserNames.length !== 0 ?
                                            <div className={styles.listContainerLeft}>
                                                {selectedUserNames && selectedUserNames.map((teacher, index) => (
                                                    <div className={styles.userListContainer} key={index}>
                                                        <div className={styles.left}>
                                                            <div className={styles.leftItem}>
                                                                <span className={styles.count}>{index + 1}.</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.center}>
                                                            <span className={styles.listUsername}> {teacher?.username}</span>
                                                        </div>
                                                        <div className={styles.right}>{teacher?.department}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            :
                                            <div className={styles.listContainerRight}>
                                                <span className={styles.none}>No one is granted permission to glimpse the letter!!!</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ActionAndComment letterData={letterData} />
                    </>
                }
            </div>
        </div>
    )
}

export default ManageLetter
