import styles from '../ManageLetter.module.css'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import React, { useState } from 'react'

const ManageLetterUserList = ({ list, teacher, index }) => {
    return (
        <div className={styles.userListContainer}>
            <div className={styles.left}>
                <div className={styles.leftItem}>
                    <span className={styles.count}>{index + 1}.</span>
                </div>
                {
                    list !== "list" && <div className={styles.leftItem}>
                        <Checkbox colorScheme='red' defaultChecked isInvalid />
                    </div>
                }
            </div>
            <div className={styles.center}>
                {teacher?.username}
            </div>
            <div className={styles.right}>{teacher?.department}</div>
        </div>
    )
}

export default ManageLetterUserList