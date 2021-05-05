import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Auth'
import styles from './PartySuccessfullyCreated.module.css'

const PartySuccessfullyCreated: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <section className={styles.createParty}>
      <h2>Party successfully created!</h2>
      <span>
        You will find it in the&nbsp;
        <Link to={'/organized_and_participation/' + currentUser.uid + '/'}>
          My parties
        </Link>
        &nbsp;tab
      </span>
    </section>
  )
}

export default PartySuccessfullyCreated
