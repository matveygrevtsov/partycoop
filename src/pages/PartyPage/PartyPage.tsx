import React, { useContext, useEffect, useState } from 'react'
import styles from './PartyPage.module.css'
import firebaseApp from '../../firebaseApp'
import ParticipantsList from '../../components/ParticipantsList/ParticipantsList'
import ImgLink from '../../components/ImgLink/ImgLink'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '../../components/Button/Button'
import { AuthContext } from '../../Auth'
import NavBar from '../../components/NavBar/NavBar'
import Preloader from '../../components/Preloader/Preloader'
import UserLabel from '../../components/UserLabel/UserLabel'
import PageNotFound from '../PageNotFound/PageNotFound'

const PartyPage: React.FC<any> = ({ match }) => {
  // current user data
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [userAge, setUserAge] = useState(0)
  const [userWaitingRequests, setUserWaitingRequests]: any = useState([])

  // current party data
  const partyId = match.params.partyId
  const [ageInterval, setAgeInterval] = useState([0, 0])
  const [authorId, setAuthorId] = useState('')
  const [description, setDescription] = useState('')
  const [guestsNumberInterval, setGuestsNumberInterval] = useState([0, 0])
  const [imageName, setImageName] = useState('')
  const [meetPoint, setMeetPoint] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [name, setName] = useState('')
  const [guestsIds, setGuestsIds]: any = useState([])
  const [waitingRequests, setWaitingRequests]: any = useState([])
  const [rejectedRequests, setRejectedRequests]: any = useState([])

  const [pending, setPending] = useState(true)
  const [partyExists, setPartyExists] = useState(false)

  function participateBtnHandler() {
    setPending(true)
    try {
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .update({
          waitingRequests: [currentUserId, ...waitingRequests],
        })

      firebaseApp
        .database()
        .ref('users/' + currentUserId)
        .update({
          waitingRequests: [partyId, ...userWaitingRequests],
        })

      setWaitingRequests([currentUserId, ...waitingRequests])
      setUserWaitingRequests([partyId, ...userWaitingRequests])
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
    }
  }

  async function rejectRequest(event: any) {
    const userId = event.target.value

    let index = waitingRequests.indexOf(userId)
    let newWaitingRequests: string[] = [...waitingRequests]
    newWaitingRequests.splice(index, 1)

    const newRejectedRequests = [userId, ...rejectedRequests]

    try {
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .update({
          waitingRequests: newWaitingRequests,
          rejectedRequests: newRejectedRequests,
        })

      let userRejectedRequests: string[] = []
      let userWaitingRequests: string[] = []

      await firebaseApp
        .database()
        .ref('users/' + userId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          const rejectedRequestsArray = data['rejectedRequests']
          if (rejectedRequestsArray) {
            userRejectedRequests = rejectedRequestsArray
          }
          const waitingRequestsArray = data['waitingRequests']
          if (waitingRequestsArray) {
            userWaitingRequests = waitingRequestsArray
          }
        })

      index = userWaitingRequests.indexOf(partyId)
      userWaitingRequests.splice(index, 1)

      await firebaseApp
        .database()
        .ref('users/' + userId)
        .update({
          rejectedRequests: [partyId, ...userRejectedRequests],
          waitingRequests: userWaitingRequests,
        })
      setWaitingRequests(newWaitingRequests)
      setRejectedRequests(newRejectedRequests)
    } catch (error) {
      console.log(error)
    }
  }

  async function acceptRequest(event: any) {
    const userId = event.target.value

    let index = waitingRequests.indexOf(userId)
    let newWaitingRequests: string[] = [...waitingRequests]
    newWaitingRequests.splice(index, 1)

    const newGuestsIds = [userId, ...guestsIds]

    try {
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .update({
          waitingRequests: newWaitingRequests,
          guests: newGuestsIds,
        })

      let userParticipation: string[] = []
      let userWaitingRequests: string[] = []

      await firebaseApp
        .database()
        .ref('users/' + userId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          const userParticipationArray = data['participation']
          if (userParticipationArray) {
            userParticipation = userParticipationArray
          }
          const waitingRequestsArray = data['waitingRequests']
          if (waitingRequestsArray) {
            userWaitingRequests = waitingRequestsArray
          }
        })

      index = userWaitingRequests.indexOf(partyId)
      userWaitingRequests.splice(index, 1)

      await firebaseApp
        .database()
        .ref('users/' + userId)
        .update({
          participation: [partyId, ...userParticipation],
          waitingRequests: userWaitingRequests,
        })
      setWaitingRequests(newWaitingRequests)
      setGuestsIds(newGuestsIds)
    } catch (error) {
      console.log(error)
    }
  }

  function actionBTN() {
    if (waitingRequests?.includes(currentUserId)) {
      return (
        <span className={styles.greenText}>Your request has been sent!</span>
      )
    }

    if (guestsIds?.includes(currentUserId)) {
      return <span className={styles.greenText}>You are a guest!</span>
    }

    if (authorId === currentUserId) {
      return <span className={styles.greenText}>You are the author!</span>
    }
    if (rejectedRequests.includes(currentUserId)) {
      return (
        <span className={styles.redText}>
          Unfortunately, your request has been rejected!
        </span>
      )
    }

    if (userAge < ageInterval[0] || userAge > ageInterval[1]) {
      return (
        <p className={styles.redText}>
          Unfortunately, you are not in the age range!
        </p>
      )
    }

    if (guestsIds.length === guestsNumberInterval[1]) {
      return (
        <p className={styles.redText}>
          Unfortunately, there are too many participants!
        </p>
      )
    }

    return <Button onClick={participateBtnHandler} text={'participate!'} />
  }

  useEffect(() => {
    function fetchPartyData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setAgeInterval(data['ageInterval'])
          setAuthorId(data['author'])
          setDescription(data['description'])
          setGuestsNumberInterval(data['guestsNumberInterval'])
          setImageName(data['imageName'])
          setMeetPoint(data['meetingPoint'])
          setMeetingTime(data['meetingTime'])
          setName(data['name'])
          const guestsIdsArray = data.guests
          if (guestsIdsArray) {
            setGuestsIds(guestsIdsArray)
          }
          const waitRequestsArray = data.waitingRequests
          if (waitRequestsArray) {
            setWaitingRequests(waitRequestsArray)
          }
          const rejectedRequestsArray = data.rejectedRequests
          if (rejectedRequestsArray) {
            setRejectedRequests(rejectedRequestsArray)
          }
          setPartyExists(true)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setPending(false))
    }

    function fetchCurrentUserData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('users/' + currentUserId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setUserAge(data['age'])
          const waitingRequestsArray = data['waitingRequests']
          if (waitingRequestsArray) {
            setUserWaitingRequests(waitingRequestsArray)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setPending(false))
    }
    fetchPartyData()
    fetchCurrentUserData()
  }, [currentUserId, partyId])

  if (pending) {
    return <Preloader />
  }

  if (!partyExists) {
    return <PageNotFound />
  }

  return (
    <>
      <NavBar />
      <section className={styles.partyCard}>
        <ImgLink
          to={'/party/' + partyId}
          imgName={imageName}
          className={styles.partyHeader}
        >
          <h2 className={styles.partyName}>{name}</h2>
        </ImgLink>
        <div className={styles.partyBody}>
          <div className={styles.partyActions}>
            {actionBTN()}
            <ParticipantsList authorId={authorId} guestsIDs={guestsIds} />
          </div>

          <h2>Description</h2>
          <div className={styles.partyDescription}>
            <div>{description}</div>
            <ul className={styles.partyDescriptionDetails}>
              <li>
                <FontAwesomeIcon
                  className={styles.iconFontAwesome}
                  size="3x"
                  icon={faClock}
                />
                <span>
                  {meetingTime} <br />
                  &nbsp;
                </span>
              </li>
              <li>
                <FontAwesomeIcon
                  className={styles.iconFontAwesome}
                  size="3x"
                  icon={faMapMarkedAlt}
                />
                <span>
                  {meetPoint} <br /> &nbsp;
                </span>
              </li>
              <li>
                <FontAwesomeIcon
                  className={styles.iconFontAwesome}
                  size="3x"
                  icon={faUsers}
                />
                <span>
                  {`${guestsNumberInterval[0]} - ${guestsNumberInterval[1]} participants`}
                  <br />
                  {`${ageInterval[0]} - ${ageInterval[1]} y.o.`}
                </span>
              </li>
            </ul>
          </div>
          {authorId === currentUserId ? (
            <>
              <h2>Requests list</h2>
              <h3>Waiting ({waitingRequests.length})</h3>
              <ul className={styles.requestsList}>
                {waitingRequests.map((userId: string) => (
                  <li>
                    <UserLabel className={styles.UserLabel} userId={userId} />
                    <button
                      className={styles.acceptRequestsBtn}
                      value={userId}
                      onClick={acceptRequest}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.rejectedRequestsBtn}
                      value={userId}
                      onClick={rejectRequest}
                    >
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
              <h3>Rejected ({rejectedRequests.length})</h3>

              <ul className={styles.requestsList}>
                {rejectedRequests.map((userId: string) => (
                  <li>
                    <UserLabel className={styles.UserLabel} userId={userId} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default PartyPage
