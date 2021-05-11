import React, { useContext, useEffect, useState } from 'react'
import styles from './Requests.module.css'
import { AuthContext } from '../../Auth'
import PartiesList from '../../components/PartiesList/PartiesList'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import RefreshButton from '../../components/RefreshButton/RefreshButton'

const Requests: React.FC = () => {
  const { userData } = useContext(AuthContext)
  const [connection, setConnection] = useState(true)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    if (userData.id) {
      setPending(false)
    }
  }, [userData])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <section className={styles.myRequests}>
      <RefreshButton />
      <h2>Waiting requests ({userData.waitingRequests.length})</h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={userData.waitingRequests}
      />
      <h2>Rejected requests ({userData.rejectedRequests.length})</h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={userData.rejectedRequests}
      />
    </section>
  )
}

export default Requests
