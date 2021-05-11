import React, { useContext, useEffect, useState } from 'react'
import styles from './OrganizedAndParticipationPartiesPage.module.css'
import PartiesList from '../../components/PartiesList/PartiesList'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import PageNotFound from '../PageNotFound/PageNotFound'
import { AuthContext } from '../../Auth'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import { User } from '../../DataTypes'
import { Link, RouteComponentProps } from 'react-router-dom'
import RefreshButton from '../../components/RefreshButton/RefreshButton'

interface MatchParams {
  userId: string
}

interface Props extends RouteComponentProps<MatchParams> {}

const OrganizedAndParticipationPartiesPage: React.FC<Props> = ({ match }) => {
  const { userData } = useContext(AuthContext)
  const userId = match.params.userId
  const [user, setUser] = useState<User | null>(null)
  const [pending, setPending] = useState(true)
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    if (userData.id === userId) {
      setUser(userData)
      setPending(false)
    } else {
      fetchUser(userId)
        .then(
          (user: User) => setUser(user),
          () => setConnection(false),
        )
        .finally(() => setPending(false))
    }
  }, [userId, userData])

  if (pending) {
    if (userData.id === userId) {
      return null
    }
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
      {userData.id === userId ? <RefreshButton /> : null}
      <h2 className={styles.counterHeading}>
        {userData.id === userId
          ? 'Organized parties '
          : 'Parties organized by ' + user.fullName + ' '}
        ({user.organizedParties.length})
      </h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.organizedParties}
      />
      <h2 className={styles.counterHeading}>
        {userData.id === userId
          ? 'Participation '
          : 'Parties that include ' + user.fullName + ' '}
        ({user.participation.length})
      </h2>
      <PartiesList
        setConnection={setConnection}
        partiesIDs={user.participation}
      />
      {userId === userData.id ? (
        <Link className={styles.createPartyLink} to="/createparty/">
          Create new
        </Link>
      ) : null}
    </section>
  )
}

export default React.memo(OrganizedAndParticipationPartiesPage)
