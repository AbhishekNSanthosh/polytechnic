import React, { useEffect, useState } from 'react'
import styles from './ListUser.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import UserList from './components/UserList';
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getUsersByAdmin } from './services/apis';

const ListUser = () => {
  const [role, setRole] = useState("student");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const location = useLocation();
  const path = location.pathname;
  const lastPart = path.split('/').pop();
  const userValue = lastPart.split('-').pop();
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (userValue === "student") {
      getUsersByAdmin("", "", "student", authToken)
    } else if (userValue === "admin") {
      getUsersByAdmin("", "", "", authToken)
    } else if (userValue === "faculty") {
      getUsersByAdmin("", "CE", "", authToken)
    }
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.dashboardTopRow}>
          <div className={styles.dashboardRowLeft}>
            <div className={styles.searchWrap}>
              <IoIosSearch className={styles.icon} />
              <input type="text" className={styles.dashboardRowLeftSearch} placeholder='Search' />
            </div>
          </div>
          <div className={styles.dashboardRowRight}>
            <div className={styles.rightItem}>
              <Select placeholder='Filter Dep wise' onChange={(e) => {
                e.preventDefault();
                setDepartment(e.target.value);
              }}>
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
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
          <UserList />
        </div>
      </div>
    </div>
  )
}

export default ListUser