import React, { useContext, useEffect, useState } from 'react'
import styles from './AllParties.module.css'
import PartiesList from '../../components/PartiesList/PartiesList'
import { AuthContext } from '../../Auth'
import { fetchAllPartiesIdsBesides } from '../../firebaseAPIhelpers/fetchFunctions'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'

const AllParties: React.FC<any> = () => {
  const [partiesIds, setPartiesIds]: any = useState([])
  const [pending, setPending] = useState(true)
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((userResponse: any) => {
        return fetchAllPartiesIdsBesides(userResponse.organizedParties)
      })
      .then((ids: any) => {
        setPartiesIds(ids)
      })
      .catch(() => {
        setConnection(false)
      })
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <section className={styles.allParties}>
      <h2>All parties ({partiesIds.length})</h2>
      <PartiesList setConnection={setConnection} partiesIDs={partiesIds} />
    </section>
  )
}

export default AllParties
