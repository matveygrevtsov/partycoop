import React, { useEffect, useState } from 'react'
import styles from './UserPage.module.css'
import firebaseApp from '../../firebaseApp'
import UserIcon from '../../components/UserIcon/UserIcon'
import NavBar from '../../components/NavBar/NavBar'
import Preloader from '../../components/Preloader/Preloader'
import PageNotFound from '../PageNotFound/PageNotFound'

const UserPage: React.FC<any> = ({ match }) => {
  const userId = match.params.userId

  const [pending, setPending] = useState(true)
  const [fullname, setFullname] = useState('')
  const [age, setAge] = useState(0)
  const [aboutMe, setAboutMe] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [organizedPartiesNumber, setOrganizedPartiesNumber] = useState(0)
  const [participationNumber, setParticipationNumber] = useState(0)

  function fetchUserData() {
    setPending(true)
    firebaseApp
      .database()
      .ref('users/' + userId)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        setFullname(data['fullname'])
        setAge(data['age'])
        setAboutMe(data['aboutMe'])
        const organizedPartiesArray = data['organizedParties']
        const participationArray = data['participation']
        if (organizedPartiesArray) {
          setOrganizedPartiesNumber(data['organizedParties'].length)
        }
        if (participationArray) {
          setParticipationNumber(data['participation'].length)
        }
        setUserExists(true)
      })
      .catch((err) => console.log(err))
      .finally(() => setPending(false))
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  if (pending) {
    return <Preloader />
  }

  if (!userExists) {
    return <PageNotFound />
  }

  return (
    <>
      <NavBar />
      <section className={styles.userCard}>
        <div className={styles.userPageContainer}>
          <UserIcon className={styles.avatar} userId={userId} />
          <div className={styles.statistics}>
            <div>
              <strong className={styles.profileStrong}>
                {organizedPartiesNumber}
              </strong>
              <br />
              Organized
            </div>
            <div>
              <strong className={styles.profileStrong}>
                {participationNumber}
              </strong>
              <br />
              Participation
            </div>
          </div>

          <div className={styles.userAboutMe}>
            <strong className={styles.profileStrong}>
              {fullname}, {age}
            </strong>
            <p>{aboutMe}</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default UserPage
