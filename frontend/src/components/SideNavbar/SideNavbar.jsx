import React, { useState, useEffect } from 'react';
import styles from './SideNavBar.module.css';
import { collegeImages } from '../../utils/helpers';
import { LuMails } from 'react-icons/lu';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { SlLogout } from 'react-icons/sl';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdManageAccounts } from 'react-icons/md';
import { useToast } from '@chakra-ui/react'
import { IoCreateOutline } from "react-icons/io5";

// ... (existing imports)

const SideNavBar = () => {
  const storedTab = localStorage.getItem('selectedTab');
  const userRole = localStorage.getItem('accessType');
  const [selectedTab, setSelectedTab] = useState(storedTab ? parseInt(storedTab) : 1);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  console.log(location.pathname)

  const navItem = [
    {
      id: 1,
      title: 'All letters',
      icon: <LuMails />,
      link: 'dashboard',
      adminOnly: false,
    },
    {
      id: 2,
      title: 'Profile',
      icon: <RiAccountPinBoxLine />,
      link: 'profile',
      adminOnly: false,
    },
    {
      id: 3,
      title: 'Create new',
      icon: <IoCreateOutline />,
      link: '/dashboard/create-grievance',
      adminOnly: false,
    },
    {
      id: 4,
      title: 'Management',
      icon: <MdManageAccounts />,
      link: 'user-management',
      adminOnly: true,
    },
  ];
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setSelectedTab(1);
    } else if (location.pathname === "/profile") {
      setSelectedTab(2);
    } else if (location.pathname === "/dashboard/create-grievance") {
      setSelectedTab(3);
    } else if (location.pathname === "/user-management") {
      setSelectedTab(4);
    }
  }, [location.pathname]);

  const filteredNavItem = userRole === 'admin' ? navItem : navItem.filter(item => !item.adminOnly);

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab.toString());
  }, [selectedTab]);

  return (
    <div className={styles.SideNavBar}>
      <div className={styles.navWrap}>
        <div className={styles.navItem}>
          <img src={collegeImages.collegeLogonew} alt="" className={styles.logo} />
        </div>
        <div className={styles.navCol}>
          {filteredNavItem.map((item) => (
            <div
              className={styles.navItemBox}
              key={item.id}
              onClick={() => {
                setSelectedTab(item.id);
                navigate(item.link);
              }}
              style={{
                backgroundColor: selectedTab === item.id && '#fff2f2',
                color: selectedTab === item.id && 'red',
              }}
            >
              {item.icon}
              <span className={styles.navtitle}>{item.title}</span>
            </div>
          ))}
          <div className={styles.logoutBox} onClick={() => {
            localStorage.clear();
            toast({
              title: 'Logout successful',
              description: "Redirecting to login page",
              status: 'error',
              duration: 2000,
              isClosable: true,
            });
            setTimeout(() => {
              window.location.reload();
              // navigate('/');
            }, 2000);
          }}>
            <SlLogout className={styles.navtitle} />
            <span className={styles.navtitle}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
