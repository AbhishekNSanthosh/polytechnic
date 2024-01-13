import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react';
import LetterList from './components/LetterList';
import { getAllLettersForAdmin, getAllLettersForStudent, getAllLettersForTeacher, getSearchResults, getTeacherPermittedLetters } from './services/apis';
import { useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi, studentApi, teacherApi } from '../../utils/helpers';
import { Loader } from '../../components/Loader';
import EmptyData from '../../components/EmptyData';

const Dashboard = () => {
    const [letters, setLetters] = useState([]);
    const [query, setQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [applyFilter, setApplyFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [goForCall, setGoForCall] = useState(false);

    const accessType = localStorage.getItem('accessType');
    const authToken = localStorage.getItem('accessToken');
    const toast = useToast();
    const location = useLocation();

    const pathArray = location.pathname.split('/');
    const lastPart = pathArray[pathArray.length - 1];

    const getLetterData = async () => {
        try {
            if (authToken !== "") {
                if (lastPart === "permitted-grievances") {
                    if (accessType === "teacher" && authToken !== "") {
                        await getTeacherPermittedLetters(sortOrder, setLetters, toast, setIsLoading);
                    }
                } else {
                    if (accessType === "admin") {
                        await getAllLettersForAdmin(setLetters, sortOrder, toast, setIsLoading);
                    } else if (accessType === "student") {
                        await getAllLettersForStudent(setLetters, sortOrder, toast, setIsLoading);
                    } else if (accessType === "teacher") {
                        await getAllLettersForTeacher(setLetters, sortOrder, toast, setIsLoading);
                    }
                }
            }
        } catch (error) {
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
    }, [authToken, applyFilter, sortOrder, lastPart, goForCall]);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.trim() !== '') {
            if (accessType === 'admin') {
                getSearchResults(adminApi.searchLetters, newQuery, setLetters, toast);
            } else if (accessType === 'teacher') {
                getSearchResults(teacherApi.searchLetters, newQuery, setLetters, toast);
            } else if (accessType === 'student') {
                getSearchResults(studentApi.searchLetters, newQuery, setLetters, toast);
            }
        } else {
            getLetterData();
        }
    };

    //removes the letter without going for another api call
    const handleDeleteLetter = (id) => {
        const updatedLetters = letters.filter(letter => letter?._id !== id);
        setLetters(updatedLetters);
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
                        <Select className={styles.select} value={sortOrder} onChange={(e) => {
                            setSortOrder(e.target.value);
                        }}>
                            <option value='desc'>Newest on top</option>
                            <option value='asc'>Oldest on top</option>
                        </Select>
                    </div>
                    {
                        accessType !== "admin" && <div className={styles.rightItem}>
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
                    }
                </div>
            </div>
            {isLoading ?
                <div className={styles.dashboardLoadingRow}>
                    <Loader />
                </div>
                :
                <>
                    {letters?.length === 0 ?
                        <div className={styles.dashboardRow}>
                            <EmptyData />
                        </div>
                        :
                        <div className={styles.dashboardRow}>
                            {letters && letters.map((letter, index) => (
                                <div key={index}>
                                    <LetterList index={index} letter={letter} handleDelete={handleDeleteLetter} />
                                </div>
                            ))}
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Dashboard