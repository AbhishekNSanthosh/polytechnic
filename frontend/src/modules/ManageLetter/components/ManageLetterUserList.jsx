import styles from '../ManageLetter.module.css'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import React, { useState } from 'react'

const ManageLetterUserList = ({ list }) => {
    return (
        <div className={styles.userListContainer}>
            <div className={styles.left}>
                <div className={styles.leftItem}>
                    <span className={styles.count}>1.</span>
                </div>
                {
                    list !== "list" && <div className={styles.leftItem}>
                        <Checkbox colorScheme='red' defaultChecked isInvalid />
                    </div>
                }
            </div>
            <div className={styles.center}>Abhishek</div>
            <div className={styles.right}>CE</div>
        </div>
    )
}

export default ManageLetterUserList