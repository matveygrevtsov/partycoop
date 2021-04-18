import React, { useContext, useEffect, useState } from 'react'
import styles from './Requests.module.css'
import firebaseApp from '../../firebaseApp'
import NavBar from '../../components/NavBar/NavBar'
import { AuthContext } from '../../Auth'
import PartiesList from '../../components/PartiesList/PartiesList'
import Preloader from '../../components/Preloader/Preloader'

const Requests: React.FC<any> = () => {
  // current user data
  const { currentUser } = useContext(AuthContext)
  const [waitingRequests, setWaitingRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])
  const [pending, setPending] = useState(true)

  function fetchUserData() {
    setPending(true)
    firebaseApp
      .database()
      .ref('users/' + currentUser.uid)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        const userWaitingRequests = data['waitingRequests']
        const userRejectedRequests = data['rejectedRequests']
        if (userWaitingRequests) {
          setWaitingRequests(userWaitingRequests)
        }
        if (userRejectedRequests) {
          setRejectedRequests(userRejectedRequests)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setPending(false))
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  if (pending) {
    return <Preloader />
  }

  return (
    <>
      <NavBar />
      <section className={styles.myRequests}>
        <h2>Waiting requests ({waitingRequests.length})</h2>
        <PartiesList partiesIDs={waitingRequests} />
        <h2>Rejected requests ({rejectedRequests.length})</h2>
        <PartiesList partiesIDs={rejectedRequests} />
      </section>
    </>
  )
}

export default Requests
