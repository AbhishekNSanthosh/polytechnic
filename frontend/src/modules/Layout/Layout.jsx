import React, { Suspense, useEffect } from 'react'
import styles from './Layout.module.css'
import { Outlet } from 'react-router-dom'
import SideNavBar from '../../components/SideNavbar/SideNavbar'
import TopNavBar from '../../components/TopNavBar/TopNavBar'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, []);

    return (
        <div className={styles.fullPage}>
            <div className={styles.SideNavBarWrap}>
                <SideNavBar />
            </div>
            <div className={styles.rightSide}>
                <TopNavBar />
                <div className={styles.mainContent}>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default Layout