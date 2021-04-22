import React, { useContext, useEffect, useState } from 'react'
import styles from './MyPartiesPage.module.css'
import Button from '../../components/Button/Button'
import { AuthContext } from '../../Auth'
import PartiesList from '../../components/PartiesList/PartiesList'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'

const MyPartiesPage: React.FC<any> = () => {
  // current user data
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [pending, setPending] = useState(true)
  const [partiesIds, setPartiesIds] = useState([])

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: any) => {
        setPartiesIds(user.organizedParties)
      })
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return <PagePreloader />
  }

  return (
    <section className={styles.myPartiesSection}>
      <h2>My parties ({partiesIds.length})</h2>
      <PartiesList partiesIDs={partiesIds} />
      <Button to="/createparty/" text="Create new" />
    </section>
  )
}

export default MyPartiesPage
