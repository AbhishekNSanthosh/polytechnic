import React from 'react'
import styles from './PolyStyles.module.css'
import { GridLoader } from 'react-spinners'

export const Loader = ({color,size}) => {
    return (
        <div className={styles.loader}>
            <GridLoader color={color ? color : '#ff4a3d'} size={size ? size : 18}/>
        </div>
    )
}
