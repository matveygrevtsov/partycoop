import React from 'react'
import styles from './Home.module.css'
import EditMyInfoForm from '../../components/EditMyInfoForm/EditMyInfoForm'
import NavBar from '../../components/NavBar/NavBar'
import firebase from '../../firebaseApp'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home: React.FC<any> = () => {
  return (
    <>
      <NavBar />
      <section className={styles.myAccountSettings}>
        <div className={styles.sectionHead}>
          <h2>My account</h2>
          <a
            className={styles.signOutLink}
            onClick={() => firebase.auth().signOut()}
          >
            <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
          </a>
        </div>
        <EditMyInfoForm />
      </section>
    </>
  )
}

export default Home
