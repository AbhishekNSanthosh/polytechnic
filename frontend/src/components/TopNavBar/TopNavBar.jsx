import React, { useState } from 'react'
import styles from './TopNavBar.module.css'
import { FiMenu } from "react-icons/fi";
import SideNavBar from '../SideNavbar/SideNavbar';
import { IoClose } from "react-icons/io5";
import { collegeImages } from '../../utils/helpers';

const TopNavBar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user);

    const drawerOpenStatus = () => {
        setIsDrawerOpen(false);
    }
    
    return (
        <>
            <div className={styles.container}>
                <div className={styles.TopNavBarWrap}>
                    <div className={styles.navBoxRes}>
                        {isDrawerOpen ?
                            <IoClose className={styles.more} color='red' onClick={() => setIsDrawerOpen(false)} />
                            :
                            <FiMenu className={styles.more} color='red' onClick={() => setIsDrawerOpen(true)} />
                        }
                    </div>
                    <div className={styles.navBoxTitle}>
                        <span className={styles.welcome}>Hello, {userObj?.username} 👋</span>
                    </div>
                    <div className={styles.navBoxRes}>
                        <img src={collegeImages?.collegelogosvg} loading='lazy' alt="" className={styles.bannerLogo} />
                    </div>
                    <div className={styles.navBox}>
                        <div className={styles.dp}>
                            <img  loading='lazy' src="https://img.freepik.com/premium-photo/astronaut-planet-with-red-background_909774-18.jpg" alt="" className={styles.dpImg} />
                        </div>
                    </div>
                </div>
            </div>
            {isDrawerOpen &&
                <div className={styles.navRes}>
                    <SideNavBar drawerOpenStatus={drawerOpenStatus} />
                </div>
            }
        </>
    )
}

export default TopNavBar