import React, { useEffect, useState } from 'react'
import styles from './ListUser.module.css'
import { IoIosSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import UserList from './components/UserList';
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { getUsersByAdmin, searchUser } from './services/apis';
import { Loader } from '../../components/Loader';
import EmptyData from '../../components/EmptyData';

const ListUser = () => {
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [users, setUsers] = useState([]);
  const [isApiOnCall, setIsApiOnCall] = useState(false);
  const [query, setQuery] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const path = location.pathname;
  const lastPart = path.split('/').pop();
  const userValue = lastPart.split('-').pop();
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState(userValue);

  const getUserData = () => {
    if (userValue === "student") {
      getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast, setIsLoading)
    } else if (userValue === "admin") {
      getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast, setIsLoading)
    } else if (userValue === "teacher") {
      getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast, setIsLoading)
    }
  }

  useEffect(() => {
    getUserData();
  }, [authToken, applyFilter]);

  const handleChange = async (e) => {
    setQuery(e.target.value)
    if (query !== "" && query !== " ") {
      await searchUser(query, role, authToken, setUsers, setIsApiOnCall, navigate, toast)
    } else {
      if (userValue === "student") {
        getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast)
      } else if (userValue === "admin") {
        getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast)
      } else if (userValue === "teacher") {
        getUsersByAdmin(semester, department, role, sortOrder, setUsers, toast)
      }
    }
  }

  //removes the user without going for another api call
  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(user => user?._id !== id);
    setUsers(updatedUsers);
  };

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
            {userValue !== "admin" &&
              <div className={styles.rightItem}>
                <Select style={{ width: '8rem' }} value={department} placeholder='Filter Dep wise' onChange={(e) => {
                  setDepartment(e.target.value)
                }}>
                  <option value='CIVIL'>CIVIL</option>
                  <option value='CSE'>CSE</option>
                  <option value='MECH'>MECH</option>
                  <option value='EEE'>EEE</option>
                  <option value='ELECTRONICS'>ELECTRONICS</option>
                  <option value='AUTOMOBILE'>AUTOMOBILE</option>
                </Select>
              </div>
            }
            {userValue === "student" &&
              <div className={styles.rightItem}>
                <Select placeholder='Filter Sem wise' value={semester} onChange={(e) => {
                  e.preventDefault();
                  setSemester(e.target.value);
                }}
                  style={{ width: '8rem' }}
                >
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
              <Select style={{ width: '8rem' }} placeholder='Sort' value={sortOrder} onChange={(e) => {
                setSortOrder(e.target.value);
              }}>
                <option value='desc'>Newest on top</option>
                <option value='asc'>Oldest on top</option>
              </Select>
            </div>
            <div className={styles.rightItem}>
              <button className={styles.apllyBtn} onClick={() => {
                getUserData()
                setApplyFilter(true);
              }}>Apply filter</button>
              {
                applyFilter &&
                <button className={styles.apllyBtn} onClick={() => {
                  setDepartment("");
                  setSemester("");
                  setSortOrder("desc");
                  setApplyFilter(false);
                }}>Remove filter</button>
              }
            </div>
          </div>
        </div>
        {
          isLoading
            ?
            <div className={styles.dashboardLoaderRow}>
              <Loader />
            </div>
            :
            <div className={styles.dashboardRow}>
              {users.length === 0 ?
                <EmptyData />
                :
                <>
                  {users && users.map((user, index) => (
                    <div key={index}>
                      <UserList user={user} index={index} handleDeleteUser={handleDeleteUser} />
                    </div>
                  ))}
                </>
              }
            </div>
        }
      </div>
    </div>
  )
}

export default ListUser;