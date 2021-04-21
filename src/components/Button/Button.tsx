import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Props = {
  onClick?: () => void
  text: string
  to?: string
  pending?: boolean
}

const Button: React.FC<Props> = ({ onClick, text, to, pending }) => {
  if (pending) {
    return <span>Загрузка ...</span>
  }
  if (to) {
    return (
      <Link className={styles.pinkButton} to={to}>
        {text}
      </Link>
    )
  }
  return (
    <div className={styles.pinkButton} onClick={onClick}>
      {text}
    </div>
  )
}

export default Button
