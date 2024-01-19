import React, { useState, useEffect, useRef } from 'react';
import styles from './SideNavBar.module.css';
import { collegeImages } from '../../utils/helpers';
import { LuMails } from 'react-icons/lu';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { SlLogout } from 'react-icons/sl';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdManageAccounts } from 'react-icons/md';
import { useToast } from '@chakra-ui/react';
import { IoCreateOutline } from 'react-icons/io5';
import { IoIosArrowForward } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { TbMailForward } from "react-icons/tb";

const SideNavBar = ({ drawerOpenStatus }) => {
  const storedTab = localStorage.getItem('selectedTab');
  const userRole = localStorage.getItem('accessType');

  const [selectedTab, setSelectedTab] = useState(
    storedTab ? parseInt(storedTab) : 1
  );
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const navItem = [
    {
      id: 1,
      title: 'All Grievances',
      icon: <LuMails />,
      link: 'dashboard',
      visibility: ['admin', 'teacher', 'student'],
    },
    {
      id: 2,
      title: 'Permitted Grievances',
      icon: <TbMailForward />,
      link: 'dashboard/permitted-grievances',
      visibility: ['teacher'],
    },
    {
      id: 3,
      title: 'Profile',
      icon: <RiAccountPinBoxLine />,
      link: 'profile',
      visibility: ['admin', 'teacher', 'student'],
    },
    {
      id: 4,
      title: 'Create new',
      icon: <IoCreateOutline />,
      link: '/dashboard/create-grievance',
      visibility: ['teacher', 'student'],
    },
    {
      id: 5,
      title: 'Management',
      icon: <MdManageAccounts />,
      link: 'user-management',
      visibility: ['admin'],
    },
    {
      id: 6,
      title: 'Download',
      icon: <FiDownload />,
      link: 'download',
      visibility: ['admin'],
    },
  ];
  
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setSelectedTab(1);
    } else if (location.pathname === '/profile') {
      setSelectedTab(3);
    } else if (location.pathname === '/dashboard/create-grievance') {
      setSelectedTab(4);
    } else if (location.pathname === '/user-management') {
      setSelectedTab(5);
    } else if (location.pathname === '/dashboard/permitted-grievances') {
      setSelectedTab(2);
    } else if (location.pathname === '/download') {
      setSelectedTab(6);
    }
  }, [location.pathname]);

  const filteredNavItem = navItem.filter((item) =>
    item.visibility.includes(userRole)
  );

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab.toString());
  }, [selectedTab]);

  return (
    <>
      <div className={styles.SideNavBar}>
        <div className={styles.navWrap}>
          <div className={styles.navItem}>
            <img
              src={collegeImages.collegeLogonew}
              alt=""
              className={styles.logo}
            />
          </div>
          <div className={styles.navCol}>
            {filteredNavItem.map((item) => (
              <div
                className={styles.navItemBox}
                key={item.id}
                onClick={() => {
                  setSelectedTab(item.id);
                  if (item?.link === 'profile') {
                    toast({
                      title: 'Profile will be available soon',
                      description: 'Sorry for the inconvenience',
                      status: 'info',
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    navigate(item.link);
                  }
                  drawerOpenStatus()
                }}
                style={{
                  backgroundColor: selectedTab === item.id && '#fff2f2',
                  color: selectedTab === item.id && 'red',
                }}
              >
                <div className={styles.itemLeft}>
                  {item.icon}
                  <span className={styles.navtitle}>{item.title}</span>
                </div>
                <div className={styles.itemRight}>
                  <IoIosArrowForward fontSize={22} />
                </div>
              </div>
            ))}
            <div
              className={styles.logoutBox}
              onClick={() => {
                localStorage.clear();
                toast({
                  title: 'Logout successful',
                  description: 'Redirecting to login page',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
                setTimeout(() => {
                  navigate('/')
                }, 1000);
                drawerOpenStatus()
              }}
            >
              <SlLogout className={styles.navtitle} />
              <span className={styles.navtitle}>Logout</span>
            </div>
          </div>

          <div className={styles.credits}>
            <span className={styles.credit}>All rights reserved</span>
            <span className={styles.credit}>Designed & Developed by Abhishek Santhosh</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
