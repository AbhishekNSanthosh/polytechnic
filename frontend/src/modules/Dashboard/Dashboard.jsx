import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import LetterList from './components/LetterList';
import { useEffect } from 'react';
import { getAllLettersForAdmin, getAllLettersForStudent, getAllLettersForTeacher, getSearchResults } from './services/apis';
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [letters, setLetters] = useState([]);
    const [query, setQuery] = useState("");
    const [isApiOnCall, setIsApiOnCall] = useState(false);
    const accessType = localStorage.getItem('accessType');
    const authToken = localStorage.getItem('accessToken');
    const toast = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        if (authToken !== "") {
            if (accessType === "admin") {
                getAllLettersForAdmin(setLetters, toast, navigate, authToken);
            } else if (accessType === "student") {
                getAllLettersForStudent(setLetters, toast, navigate, authToken);
            } else if (accessType === "teacher") {
                getAllLettersForTeacher(setLetters, toast, navigate, authToken)
            }
        }
    }, [authToken]);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        if (!isApiOnCall && query !== "") {
            getSearchResults(query, authToken, setLetters, setIsApiOnCall,toast);
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
                    <div className={styles.rightItem}>
                        <Select placeholder='Filter Dep wise'>
                            <option value='option1'>CE</option>
                            <option value='option2'>CSE</option>
                            <option value='option3'>ME</option>
                            <option value='option3'>EEE</option>
                        </Select>
                    </div>
                    <div className={styles.rightItem}>
                        <Select placeholder='Sort'>
                            <option value='desc'>Newest on top</option>
                            <option value='asce'>Oldest on top</option>
                        </Select>
                    </div>
                    <div className={styles.rightItem}>
                        <button className={styles.apllyBtn}>Apply filter</button>
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