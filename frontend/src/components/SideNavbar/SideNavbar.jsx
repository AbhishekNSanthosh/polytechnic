import React from 'react'
import styles from './SideNavBar.module.css'
import { collegeImages } from '../../utils/helpers'

const SideNavBar = () => {

  const tags = [
    "Passwords",
    "Travel",
  ]

  return (
    <div className={styles.SideNavBar}>
      <div className={styles.navWrap}>
        <div className={styles.navItem}>
          <img src={collegeImages.collegeLogonew} alt="" className={styles.logo} />
        </div>
      </div>
    </div>
  )
}

export default SideNavBar