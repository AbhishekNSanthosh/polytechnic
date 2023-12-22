import styles from '../ManageLetter.module.css'

import React from 'react'

const ManageLetterUserList = () => {
  return (
    <div className={styles.userListContainer}>
        <div className={styles.left}>1.</div>
        <div className={styles.center}>Abhishek</div>
        <div className={styles.right}>CE</div>
    </div>
  )
}

export default ManageLetterUserList