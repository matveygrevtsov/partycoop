import React, { useContext, useEffect, useState } from 'react'
import styles from './OrganizedAndParticipationPartiesPage.module.css'
import Button from '../../components/Button/Button'
import PartiesList from '../../components/PartiesList/PartiesList'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import PageNotFound from '../PageNotFound/PageNotFound'
import { AuthContext } from '../../Auth'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'

const OrganizedAndParticipationPartiesPage: React.FC<any> = ({ match }) => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const userId = match.params.userId
  const [user, setUser]: any = useState(null)
  const [pending, setPending] = useState(false)
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    setPending(true)
    fetchUser(userId)
      .then(
        (user: any) => {
          setUser(user)
        },
        () => setConnection(false),
      )
      .finally(() => setPending(false))
  }, [userId])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (!user) {
    return <PageNotFound />
  }

  return (
    <section className={styles.organizedAndParticipationPartiesSection}>
      <h2>
        Parties organized by {user.fullName} ({user.organizedParties.length})
      </h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.organizedParties}
      />
      <h2>
        Parties that include {user.fullName} ({user.participation.length})
      </h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.participation}
      />
      {userId === currentUserId ? (
        <Button to="/createparty/" text="Create new" />
      ) : null}
    </section>
  )
}

export default OrganizedAndParticipationPartiesPage