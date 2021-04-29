import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

const Button: React.FC<{
  onClick?: () => void
  text: string
  to?: string
  pending?: boolean
}> = (props) => {
  if (props.pending) {
    return <span>Загрузка ...</span>
  }
  if (props.to) {
    return (
      <Link className={styles.pinkButton} to={props.to}>
        {props.text}
      </Link>
    )
  }
  return (
    <div className={styles.pinkButton} onClick={props.onClick}>
      {props.text}
    </div>
  )
}

export default Button
