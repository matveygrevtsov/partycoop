import React from 'react'
import styles from './Welcome.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <section className={styles.welcomeSection}>
      <CenterLogo />
      <div>
        <h1>Welcome to Partycoop !</h1>
        <Link className={styles.signBtn} to={'/signin'}>
          Sign In
        </Link>
        <Link className={styles.signBtn} to={'/signup'}>
          Sign Up
        </Link>
      </div>
    </section>
  )
}

export default Home
