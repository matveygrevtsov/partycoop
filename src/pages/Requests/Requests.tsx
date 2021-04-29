import React, { useContext, useEffect, useState } from 'react'
import styles from './Requests.module.css'
import { AuthContext } from '../../Auth'
import PartiesList from '../../components/PartiesList/PartiesList'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import { User } from '../../DataTypes'

const Requests: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [pending, setPending] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then(
        (userResponse: User) => setUser(userResponse),
        () => setConnection(false),
      )
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if(!user) {
    return null
  }

  return (
    <section className={styles.myRequests}>
      <h2>Waiting requests ({user.waitingRequests.length})</h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.waitingRequests}
      />
      <h2>Rejected requests ({user.rejectedRequests.length})</h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.rejectedRequests}
      />
    </section>
  )
}

export default Requests
