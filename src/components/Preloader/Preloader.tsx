import React from 'react'
import styles from './Preloader.module.css'

import preloader from '../../images/preloader.gif'

const Preloader: React.FC<any> = () => {
  return (
    <div className={styles.preloader}>
      <img src={preloader} alt="preloader" />
    </div>
  )
}

export default Preloader
