import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Props = {
  onClick?: () => void
  text: string
  to?: string
}

const Button: React.FC<Props> = ({ onClick, text, to }) => {
  return to ? (
    <Link className={styles.pinkButton} to={to}>
      {text}
    </Link>
  ) : (
    <div className={styles.pinkButton} onClick={onClick}>
      {text}
    </div>
  )
}

export default Button
