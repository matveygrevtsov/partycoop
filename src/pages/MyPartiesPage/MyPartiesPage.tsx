import React, { useContext, useEffect, useState } from 'react'
import styles from './MyPartiesPage.module.css'
import firebaseApp from '../../firebaseApp'
import Button from '../../components/Button/Button'
import { AuthContext } from '../../Auth'
import NavBar from '../../components/NavBar/NavBar'
import Preloader from '../../components/Preloader/Preloader'
import PartiesList from '../../components/PartiesList/PartiesList'

const MyPartiesPage: React.FC<any> = () => {
  // current user data
  const { currentUser } = useContext(AuthContext)
  const [organizedParties, setOrganizedParties] = useState([])
  const [pending, setPending] = useState(true)
  const currentUserUid = currentUser.uid

  useEffect(() => {
    function fetchUserData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('users/' + currentUserUid)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          const organizedPartiesArray = data['organizedParties']
          if (organizedPartiesArray) {
            setOrganizedParties(organizedPartiesArray)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setPending(false))
    }
    fetchUserData()
  }, [currentUserUid])

  if (pending) {
    return <Preloader />
  }

  return (
    <>
      <NavBar />
      <section className={styles.myPartiesSection}>
        <h2>My parties ({organizedParties.length})</h2>
        <PartiesList partiesIDs={organizedParties} />
        <Button to="/createparty/" text="Create new" />
      </section>
    </>
  )
}

export default MyPartiesPage
