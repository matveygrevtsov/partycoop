import React, { useContext } from 'react'
import { AuthContext } from '../../Auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import styles from './RefreshButton.module.css'

const RefreshButton: React.FC = () => {
  const { refetchData } = useContext(AuthContext)
  return (
    <button onClick={refetchData} className={styles.refreshPartiesList}>
      <FontAwesomeIcon icon={faSyncAlt} size="2x" />
    </button>
  )
}

export default RefreshButton
