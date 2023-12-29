import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react';
import LetterList from './components/LetterList';
import { getAllLettersForAdmin, getAllLettersForStudent, getAllLettersForTeacher, getSearchResults, getTeacherPermittedLetters } from './services/apis';
import { useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';

const Dashboard = () => {
    const [letters, setLetters] = useState([]);
    const [query, setQuery] = useState("");
    const [isApiOnCall, setIsApiOnCall] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [applyFilter, setApplyFilter] = useState(false);
    const abortController = new AbortController();

    const accessType = localStorage.getItem('accessType');
    const authToken = localStorage.getItem('accessToken');
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const pathArray = location.pathname.split('/');
    const lastPart = pathArray[pathArray.length - 1];

    const getLetterData = async () => {
        try {
            if (authToken !== "") {
                if (lastPart === "permitted-grievances") {
                    if (accessType === "teacher" && authToken !== "") {
                        await getTeacherPermittedLetters(sortOrder, setLetters, authToken, navigate, toast, abortController);
                    }
                } else {
                    if (accessType === "admin") {
                        await getAllLettersForAdmin(setLetters, sortOrder, toast, navigate, authToken, abortController);
                    } else if (accessType === "student") {
                        await getAllLettersForStudent(setLetters, sortOrder, toast, navigate, authToken, abortController);
                    } else if (accessType === "teacher") {
                        await getAllLettersForTeacher(setLetters, sortOrder, toast, navigate, authToken, abortController);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching letter data:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch letter data. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        getLetterData();

        // Cleanup function to abort the request when the component is unmounted
        return () => abortController.abort();
    }, [authToken, applyFilter, sortOrder, lastPart]);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.trim() !== '') {
            if (accessType === 'admin') {
                getSearchResults(adminApi.searchLetters, newQuery, authToken, setLetters, toast);
            } else if (accessType === 'teacher') {
                getSearchResults(teacherApi.searchLetters, newQuery, authToken, setLetters, toast);
            } else if (accessType === 'student') {
                getSearchResults(studentApi.searchLetters, newQuery, authToken, setLetters, toast);
            }
        } else {
            getLetterData();
        }
    };

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
                    <div className={styles.rightItem}>
                        <Select className={styles.select} placeholder='Sort' value={sortOrder} onChange={(e) => {
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