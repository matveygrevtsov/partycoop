import React from 'react'
import styles from './Home.module.css'
import EditMyInfoForm from '../../components/EditMyInfoForm/EditMyInfoForm'

const Home: React.FC<any> = () => {
  return (
    <section className={styles.myAccountSettings}>
      <div className={styles.sectionHead}>
        <h2>My account</h2>
      </div>
      <EditMyInfoForm />
    </section>
  )
}

export default Home
