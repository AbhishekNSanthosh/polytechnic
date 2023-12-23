import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import LetterList from './components/LetterList';
import { useEffect } from 'react';
import { getAllLettersForAdmin, getAllLettersForStudent, getAllLettersForTeacher, getSearchResults } from './services/apis';
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';

const Dashboard = () => {
    const [letters, setLetters] = useState([]);
    const [query, setQuery] = useState("");
    const [isApiOnCall, setIsApiOnCall] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [applyFilter, setApplyFilter] = useState(false);

    const accessType = localStorage.getItem('accessType');
    const authToken = localStorage.getItem('accessToken');
    const toast = useToast();
    const navigate = useNavigate();

    const getLetterData = () => {
        if (authToken !== "") {
            if (accessType === "admin") {
                getAllLettersForAdmin(setLetters, sortOrder, toast, navigate, authToken);
            } else if (accessType === "student") {
                getAllLettersForStudent(setLetters, sortOrder, toast, navigate, authToken);
            } else if (accessType === "teacher") {
                getAllLettersForTeacher(setLetters, sortOrder, toast, navigate, authToken)
            }
        }
    }

    useEffect(() => {
        getLetterData();
    }, [authToken, applyFilter]);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        if (!isApiOnCall && query !== "" && query !== " ") {
            if (accessType === "admin") {
                getSearchResults(adminApi.searchLetters, query, authToken, setLetters, setIsApiOnCall, toast);
            } else if (accessType === "teacher") {
                getSearchResults(teacherApi.searchLetters, query, authToken, setLetters, setIsApiOnCall, toast);
            } else if (accessType === "student") {
                getSearchResults(studentApi.searchLetters, query, authToken, setLetters, setIsApiOnCall, toast);
            }
        } else {
            getLetterData();
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.dashboardTopRow}>
                <div className={styles.dashboardRowLeft}>
                    <div className={styles.searchWrap}>
                        <IoIosSearch className={styles.icon} />
                        <input type="text" onChange={(e) => {
                            handleQueryChange(e)
                        }} className={styles.dashboardRowLeftSearch} placeholder='Search' />
                    </div>
                </div>
                <div className={styles.dashboardRowRight}>
                    {/* <div className={styles.rightItem}>
                        <Select placeholder='Filter Dep wise'>
                            <option value='option1'>CE</option>
                            <option value='option2'>CSE</option>
                            <option value='option3'>ME</option>
                            <option value='option3'>EEE</option>
                        </Select>
                    </div> */}
                    <div className={styles.rightItem}>
                        <Select placeholder='Sort' value={sortOrder} onChange={(e) => {
                            setSortOrder(e.target.value);
                        }}>
                            <option value='desc'>Newest on top</option>
                            <option value='asc'>Oldest on top</option>
                        </Select>
                    </div>
                    <div className={styles.rightItem}>
                        <button className={styles.apllyBtn} onClick={() => {
                            getLetterData();
                            setApplyFilter(true);
                        }}>Apply filter</button>
                        {applyFilter &&
                            <button className={styles.removeBtn} onClick={() => {
                                setSortOrder("desc");
                                // setTimeout(() => {
                                //     getLetterData();
                                // }, 1000)
                                setApplyFilter(false);
                            }}>Remove filter</button>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.dashboardRow}>
                {letters && letters.map((letter, index) => (
                    <div key={index}>
                        <LetterList index={index} letter={letter} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard