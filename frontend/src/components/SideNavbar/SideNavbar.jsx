import React, { useState } from 'react'
import styles from './SideNavBar.module.css'
import { collegeImages } from '../../utils/helpers'
import { LuMails } from "react-icons/lu";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { SlLogout } from "react-icons/sl";
import { useNavigate } from 'react-router-dom'

const SideNavBar = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate()

  const navItem = [
    {
      id: 1,
      title: "All letters",
      icon: <LuMails />,
      link: "dashboard"
    },
    {
      id: 2,
      title: "Profile",
      icon: <RiAccountPinBoxLine />,
      link: "profile"
    },
  ]

  return (
    <div className={styles.SideNavBar}>
      <div className={styles.navWrap}>
        <div className={styles.navItem}>
          <img src={collegeImages.collegeLogonew} alt="" className={styles.logo} />
        </div>
        <div className={styles.navCol}>
          {navItem.map((item) => (
            <div className={styles.navItemBox} key={item.id} onClick={() => {
              setSelectedTab(item.id);
              navigate(item.link)
            }} style={{
              backgroundColor: selectedTab === item.id
                && '#ffe8e8',
                color:selectedTab === item.id && 'red'
            }}>
              {item.icon}
              <span className={styles.navtitle}>{item.title}</span>
            </div>
          ))}
          <div className={styles.logoutBox}>
            <SlLogout className={styles.navtitle} />
            <span className={styles.navtitle}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNavBar