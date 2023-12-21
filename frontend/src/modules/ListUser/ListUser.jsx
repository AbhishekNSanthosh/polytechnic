import React, { useEffect, useState } from 'react'
import styles from './ListUser.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import UserList from './components/UserList';
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getUsersByAdmin, searchUser } from './services/apis';

const ListUser = () => {
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [users, setUsers] = useState([]);
  const [isApiOnCall, setIsApiOnCall] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const path = location.pathname;
  const lastPart = path.split('/').pop();
  const userValue = lastPart.split('-').pop();
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState(userValue);

  useEffect(() => {
    if (userValue === "student") {
      getUsersByAdmin(semester, department, role, authToken, setUsers)
    } else if (userValue === "admin") {
      getUsersByAdmin(semester, department, role, authToken, setUsers)
    } else if (userValue === "teacher") {
      getUsersByAdmin(semester, department, "teacher", authToken, setUsers)
    }
  }, []);

  const handleChange = async (e) => {
    setQuery(e.target.value)
    if (!isApiOnCall && query !== "") {
      await searchUser(query, role, authToken, setUsers, setIsApiOnCall)
    } else {
      if (userValue === "student") {
        getUsersByAdmin(semester, department, role, authToken, setUsers)
      } else if (userValue === "admin") {
        getUsersByAdmin(semester, department, role, authToken, setUsers)
      } else if (userValue === "teacher") {
        getUsersByAdmin(semester, department, "teacher", authToken, setUsers)
      }
    }
  }



  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <span className={styles.topTitle}> All {userValue}s</span>
        </div>
        <div className={styles.dashboardTopRow}>
          <div className={styles.dashboardRowLeft}>
            <div className={styles.searchWrap}>
              <IoIosSearch className={styles.icon} />
              <input type="text" className={styles.dashboardRowLeftSearch} placeholder='Search' onChange={(e) => {
                handleChange(e)
              }} />
            </div>
          </div>
          <div className={styles.dashboardRowRight}>
            <div className={styles.rightItem}>
              <Select placeholder='Filter Dep wise' onChange={(e) => {
                setDepartment(e.target.value)
              }}>
                <option value='CE'>CE</option>
                <option value='CS'>CSE</option>
                <option value='ME'>ME</option>
                <option value='EEE'>EEE</option>
              </Select>
            </div>
            {userValue === "student" &&
              <div className={styles.rightItem}>
                <Select placeholder='Filter Dep wise' onChange={(e) => {
                  e.preventDefault();
                  setSemester(e.target.value);
                }}>
                  <option value='S1'>S1</option>
                  <option value='S2'>S2</option>
                  <option value='S3'>S3</option>
                  <option value='S4'>S4</option>
                  <option value='S5'>S5</option>
                  <option value='S6'>S6</option>
                </Select>
              </div>
            }
            <div className={styles.rightItem}>
              <Select placeholder='Sort'>
                <option value='desc'>Newest on top</option>
                <option value='asc'>Oldest on top</option>
              </Select>
            </div>
            <div className={styles.rightItem}>
              <button className={styles.apllyBtn}>Apply filter</button>
            </div>
          </div>
        </div>
        <div className={styles.dashboardRow}>
          {users && users.map((user, index) => (
            <div key={index}>
              <UserList user={user} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListUser;