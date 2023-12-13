import React from 'react'
import styles from './TopNavBar.module.css'

const TopNavBar = () => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user);
    return (
        <div className={styles.container}>
            <div className={styles.TopNavBarWrap}>
                <div className={styles.navBox}>
                    <span className={styles.welcome}>Hello, {userObj?.username} 👋</span>
                </div>
                <div className={styles.navBox}>
                    <div className={styles.dp}>
                        <img src="https://img.freepik.com/premium-photo/astronaut-planet-with-red-background_909774-18.jpg" alt="" className={styles.dpImg} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNavBar