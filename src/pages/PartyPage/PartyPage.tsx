import React, { useContext, useEffect, useState } from 'react'
import styles from './PartyPage.module.css'
import firebaseApp from '../../firebaseApp'
import ParticipantsList from '../../components/ParticipantsList/ParticipantsList'
import ImgLink from '../../components/ImgLink/ImgLink'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthContext } from '../../Auth'
import NavBar from '../../components/NavBar/NavBar'
import Preloader from '../../components/Preloader/Preloader'
import PageNotFound from '../PageNotFound/PageNotFound'
import PartyControlRequestsForm from '../../components/PartyControlRequestsForm/PartyControlRequestsForm'
import ParticipateButton from '../../components/ParticipateButton/ParticipateButton'

const PartyPage: React.FC<any> = ({ match }) => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const partyId = match.params.partyId
  const [user, setUser]: any = useState({})
  const [party, setParty]: any = useState({})
  const [pending, setPending] = useState(true)
  const [partyExists, setPartyExists] = useState(false)

  const participateHandle = () => {
    setUser({
      ...user,
      waitingRequests: [partyId, ...(user.waitingRequests || [])],
    })
    setParty({
      ...party,
      waitingRequests: [currentUserId, ...(party.waitingRequests || [])],
    })
  }

  const requestsControlActionHandle = (action: any) => {
    setParty({
      ...party,
      waitingRequests: party.waitingRequests.filter(
        (id: string) => id !== action.userId,
      ),
    })
    switch (action.type) {
      case 'accept':
        setParty({
          ...party,
          guests: [action.userId, ...(party.guests || [])],
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== action.userId,
          ),
        })
        return
      case 'reject':
        setParty({
          ...party,
          rejectedRequests: [action.userId, ...(party.rejectedRequests || [])],
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== action.userId,
          ),
        })
        return
    }
  }

  useEffect(() => {
    function fetchParty() {
      setPending(true)
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setParty({
            id: partyId,
            ageInterval: data.ageInterval,
            author: data.author,
            description: data.description,
            guestsNumberInterval: data.guestsNumberInterval,
            imageName: data.imageName,
            meetingPoint: data.meetingPoint,
            meetingTime: data.meetingTime,
            name: data.name,
            guests: data.guests || [],
            waitingRequests: data.waitingRequests || [],
            rejectedRequests: data.rejectedRequests || [],
          })
          setPartyExists(true)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setPending(false))
    }

    function fetchUser() {
      setPending(true)
      firebaseApp
        .database()
        .ref('users/' + currentUserId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setUser({
            id: currentUserId,
            waitingRequests: data.waitingRequests || [],
            age: data.age,
          })
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setPending(false))
    }
    fetchParty()
    fetchUser()
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
          imgName={party.imageName}
          className={styles.partyHeader}
        >
          <h2 className={styles.partyName}>{party.name}</h2>
        </ImgLink>
        <div className={styles.partyBody}>
          <div className={styles.partyActions}>
            <ParticipateButton
              actionHandle={participateHandle}
              party={party}
              user={user}
            />
            <ParticipantsList
              authorId={party.author}
              guestsIDs={party.guests}
            />
          </div>

          <h2>Description</h2>
          <div className={styles.partyDescription}>
            <div>{party.description}</div>
            <ul className={styles.partyDescriptionDetails}>
              <li>
                <FontAwesomeIcon
                  className={styles.iconFontAwesome}
                  size="3x"
                  icon={faClock}
                />
                <span>
                  {party.meetingTime} <br />
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
                  {party.meetingPoint} <br /> &nbsp;
                </span>
              </li>
              <li>
                <FontAwesomeIcon
                  className={styles.iconFontAwesome}
                  size="3x"
                  icon={faUsers}
                />
                <span>
                  {`${party.guestsNumberInterval[0]} - ${party.guestsNumberInterval[1]} participants`}
                  <br />
                  {`${party.ageInterval[0]} - ${party.ageInterval[1]} y.o.`}
                </span>
              </li>
            </ul>
          </div>
          {party.author === currentUserId ? (
            <PartyControlRequestsForm
              handleAction={requestsControlActionHandle}
              party={party}
            />
          ) : null}
        </div>
      </section>
    </>
  )
}

export default PartyPage
