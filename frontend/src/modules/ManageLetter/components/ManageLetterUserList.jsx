import styles from '../ManageLetter.module.css'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import React from 'react'

const ManageLetterUserList = ({ list }) => {
    return (
        <div className={styles.userListContainer}>
            <div className={styles.left}>
                <div className={styles.leftItem}></div>
                {
                    list && <div className={styles.leftItem}>
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