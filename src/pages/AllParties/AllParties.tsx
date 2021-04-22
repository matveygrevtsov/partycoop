import React, { useContext, useEffect, useState } from 'react'
import styles from './AllParties.module.css'
import PartiesList from '../../components/PartiesList/PartiesList'
import { AuthContext } from '../../Auth'
import { fetchAllPartiesIds } from '../../firebaseAPIhelpers/fetchFunctions'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'

const AllParties: React.FC<any> = () => {
  const [partiesIds, setPartiesIds]: any = useState([])
  const [pending, setPending] = useState(true)
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: any) => {
        fetchAllPartiesIds().then((ids: any) => {
          setPartiesIds(
            ids.filter((id: string) => !user.organizedParties.includes(id)),
          )
        })
      })
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return  <PagePreloader />
  }

  return (
    <section className={styles.allParties}>
      <h2>All parties ({partiesIds.length})</h2>
      <PartiesList partiesIDs={partiesIds} />
    </section>
  )
}

export default AllParties
