import React from 'react'
import styles from './PagePreloader.module.css'

const PagePreloader: React.FC<any> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.shadow} />
      <div className={styles.shadow} />
      <div className={styles.shadow} />
      <span>Loading</span>
    </div>
  )
}
export default PagePreloader
