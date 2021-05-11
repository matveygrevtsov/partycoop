import React from 'react'
import styles from './InternetConnectionProblem.module.css'

const InternetConnectionProblem: React.FC = () => {
  return (
    <div className={styles.connectionFail}>
      <h2>Internet connection problems. Please try again later.</h2>
    </div>
  )
}

export default InternetConnectionProblem
