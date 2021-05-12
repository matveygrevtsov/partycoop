import React, { useContext, useEffect, useState } from 'react'
import styles from './AllParties.module.css'
import PartiesList from '../../components/PartiesList/PartiesList'
import { AuthContext } from '../../Auth'
import { fetchAllPartiesIdsBesides } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import RefreshButton from '../../components/RefreshButton/RefreshButton'

const AllParties: React.FC = () => {
  const [partiesIds, setPartiesIds] = useState<string[]>([])
  const [pending, setPending] = useState(true)
  const { userData } = useContext(AuthContext)
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    if (userData.id) {
      fetchAllPartiesIdsBesides(userData.organizedParties)
        .then(
          (ids: string[]) => setPartiesIds(ids),
          () => setConnection(false),
        )
        .finally(() => setPending(false))
    }
  }, [userData])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <section className={styles.allParties}>
      <h2>All parties ({partiesIds.length})</h2>
      <RefreshButton />
      <PartiesList setConnection={setConnection} partiesIDs={partiesIds} />
    </section>
  )
}

export default AllParties
