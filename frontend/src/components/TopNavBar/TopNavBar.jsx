import React, { useState } from 'react'
import styles from './TopNavBar.module.css'
import { FiMenu } from "react-icons/fi";
import SideNavBar from '../SideNavbar/SideNavbar';

const TopNavBar = () => {
    const [isDrawerOpen,setIsDrawerOpen] = useState(false);
    
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user);
    return (
        <>
            <div className={styles.container}>
                <div className={styles.TopNavBarWrap}>
                    <div className={styles.navBox}>
                        <FiMenu className={styles.more} color='red' />
                    </div>
                    <div className={styles.navBoxTitle}>
                        <span className={styles.welcome}>Hello, {userObj?.username} 👋</span>
                    </div>
                    <div className={styles.navBox}>
                        <div className={styles.dp}>
                            <img src="https://img.freepik.com/premium-photo/astronaut-planet-with-red-background_909774-18.jpg" alt="" className={styles.dpImg} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.navRes}>
                <SideNavBar />
            </div>
        </>
    )
}

export default TopNavBar