import React from 'react'

import styles from './Welcome.module.css'

import CenterLogo from '../../components/CenterLogo/CenterLogo'
import Button from '../../components/Button/Button'

const Home: React.FC<any> = () => {
  return (
    <section className={styles.welcomeSection}>
      <CenterLogo />
      <div>
        <h1>Welcome to Partycoop !</h1>
        <Button to={'/signin'} text={'Sign In'} />
        <Button to={'/signup'} text={'Sign Up'} />
      </div>
    </section>
  )
}

export default Home
