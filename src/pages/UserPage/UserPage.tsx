import React, { useEffect, useState } from 'react'
import styles from './UserPage.module.css'
import PageNotFound from '../PageNotFound/PageNotFound'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import ImgLink from '../../components/ImgLink/ImgLink'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import { Link } from 'react-router-dom'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import { User } from '../../DataTypes'

const UserPage: React.FC<any> = ({ match }) => {
  const userId = match.params.userId
  const [pending, setPending] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [connection, setConnection] = useState(true)

  useEffect(() => {
    setConnection(true)
    setPending(true)
    fetchUser(userId)
      .then(
        (user: User) => {
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
    <section className={styles.userCard}>
      <div className={styles.userPageContainer}>
        <ImgLink
          to={'/user/' + user.id}
          className={styles.avatar}
          imageName={user.imageName}
        />
        <div className={styles.statistics}>
          <Link to={'/organized_and_participation/' + userId}>
            <strong className={styles.profileStrong}>
              {user.organizedParties.length}
            </strong>
            <br />
            Organized
          </Link>
          <Link to={'/organized_and_participation/' + userId}>
            <strong className={styles.profileStrong}>
              {user.participation.length}
            </strong>
            <br />
            Participation
          </Link>
        </div>

        <div className={styles.userAboutMe}>
          <strong className={styles.profileStrong}>
            {user.fullName}, {user.age}
          </strong>
          <p>{user.aboutMe}</p>
        </div>
      </div>
    </section>
  )
}

export default React.memo(UserPage)
