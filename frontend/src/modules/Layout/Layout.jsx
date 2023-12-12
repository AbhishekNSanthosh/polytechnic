import React, { Suspense } from 'react'
import styles from './Layout.module.css'
import { Outlet } from 'react-router-dom'
import SideNavBar from '../../components/SideNavbar/SideNavbar'
import TopNavBar from '../../components/TopNavBar/TopNavBar'
const Layout = () => {
    return (
        <div className={styles.fullPage}>
            <SideNavBar />
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