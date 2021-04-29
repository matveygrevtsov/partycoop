import React from 'react'
import styles from './CenterLogo.module.css'
import logo from '../../images/logo.png'

const CenterLogo: React.FC = () => {
  return <img className={styles.centerLogo} src={logo} alt="Partycoop_logo" />
}

export default CenterLogo
