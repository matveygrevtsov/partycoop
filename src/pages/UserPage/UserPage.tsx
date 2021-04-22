import React, { useEffect, useState } from 'react'
import styles from './UserPage.module.css'
import PageNotFound from '../PageNotFound/PageNotFound'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import ImgLink from '../../components/ImgLink/ImgLink'
import PagePreloader from '../../components/PagePreloader/PagePreloader'

const UserPage: React.FC<any> = ({ match }) => {
  const userId = match.params.userId
  const [pending, setPending] = useState(true)
  const [user, setUser]: any = useState(null)

  useEffect(() => {
    setPending(true)
    fetchUser(userId)
      .then((user: any) => {
        setUser(user)
      })
      .finally(() => setPending(false))
  }, [userId])

  if (pending) {
    return <PagePreloader />
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
          <div>
            <strong className={styles.profileStrong}>
              {user.organizedParties.length}
            </strong>
            <br />
            Organized
          </div>
          <div>
            <strong className={styles.profileStrong}>
              {user.participation.length}
            </strong>
            <br />
            Participation
          </div>
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

export default UserPage
