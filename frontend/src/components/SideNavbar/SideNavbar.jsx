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

const SideNavBar = () => {
  const storedTab = localStorage.getItem('selectedTab');
  const userRole = localStorage.getItem('accessType');

  const [marginTop, setMarginTop] = useState('0px');
  const [transform2, setTransform2] = useState('0deg');
  const [transform3, setTransform3] = useState('0deg');
  const [hamburgerIconDisplay, setHamburgerIconDisplay] = useState('block');

  const [sideNavDisplay, setSideNavDisplay] = useState(
    window.innerWidth > 830 ? 'flex' : 'none'
  );

  useEffect(() => {
    const handleResize = () =>
      setSideNavDisplay(window.innerWidth > 830 ? 'flex' : 'none');

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animateHamburgerIcon = () => {
    setMarginTop(sideNavDisplay === 'none' ? '-15px' : '0px');
    setTransform2(sideNavDisplay === 'none' ? '45deg' : '0deg');
    setTransform3(sideNavDisplay === 'none' ? '135deg' : '0deg');
    setHamburgerIconDisplay(sideNavDisplay === 'none' ? 'none' : 'block');
  };

  const myElementRef = useRef < HTMLDivElement > (null);
  const element = document.getElementById('right');

  const toggleSideNavBar = () => {
    if (window.innerWidth <= 830) {
      animateHamburgerIcon();
      setSideNavDisplay(sideNavDisplay === 'flex' ? 'none' : 'flex');

      // Right side content transition
      element.style.transition = '.3s ease-in-out';
      element.style.transform === 'scale(1.1)'
        ? (element.style.transform = 'unset')
        : (element.style.transform = 'scale(1.1)');
    }
  };

  const [selectedTab, setSelectedTab] = useState(
    storedTab ? parseInt(storedTab) : 1
  );
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  console.log(location.pathname);

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
      icon: <LuMails />,
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
            <div
              className={styles.logoutBox}
              onClick={() => {
                localStorage.clear();
                toast({
                  title: 'Logout successful',
                  description: 'Redirecting to login page',
                  status: 'error',
                  duration: 2000,
                  isClosable: true,
                });
                setTimeout(() => {
                  window.location.reload();
                  // navigate('/');
                }, 2000);
              }}
            >
              <SlLogout className={styles.navtitle} />
              <span className={styles.navtitle}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
