import React from 'react'
import styles from './InternetConnectionProblem.module.css'
import connectionFail from '../../images/connectionFail.png'

const InternetConnectionProblem: React.FC<any> = () => {
  return (
    <div className={styles.connectionFail}>
      <img src={connectionFail} alt="connection fail" />
      <h2>Internet connection problems. Please try again later.</h2>
    </div>
  )
}

export default InternetConnectionProblem
