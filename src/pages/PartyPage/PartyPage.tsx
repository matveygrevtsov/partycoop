import React, { useContext, useEffect, useState } from 'react'
import styles from './PartyPage.module.css'
import ParticipantsList from '../../components/ParticipantsList/ParticipantsList'
import ImgLink from '../../components/ImgLink/ImgLink'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthContext } from '../../Auth'
import PageNotFound from '../PageNotFound/PageNotFound'
import PartyControlRequestsForm from '../../components/PartyControlRequestsForm/PartyControlRequestsForm'
import ParticipateButton from '../../components/ParticipateButton/ParticipateButton'
import {
  fetchParty,
  fetchUser,
  fetchUsers,
} from '../../firebaseAPIhelpers/fetchFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'

const PartyPage: React.FC<any> = ({ match }) => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const partyId = match.params.partyId
  const [user, setUser]: any = useState(null)
  const [party, setParty]: any = useState(null)
  const [guests, setGuests]: any = useState({})
  const [waitingRequests, setWaitingRequests]: any = useState({})
  const [rejectedRequests, setRejectedRequests]: any = useState({})
  const [author, setAuthor]: any = useState(null)

  const [pending, setPending] = useState(true)

  const [connection, setConnection] = useState(true)

  const requestsControlActionHandle = (action: any) => {
    switch (action.type) {
      case 'accept':
        setParty({
          ...party,
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== action.userId,
          ),
          guests: [action.userId, ...party.guests],
        })
        setGuests({
          [action.userId]: waitingRequests[action.userId],
          ...guests,
        })
        break
      case 'reject':
        setParty({
          ...party,
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== action.userId,
          ),
          rejectedRequests: [action.userId, ...party.rejectedRequests],
        })
        setRejectedRequests({
          [action.userId]: waitingRequests[action.userId],
          ...rejectedRequests,
        })
        break
    }
    const newWaitingRequests = Object.assign({}, waitingRequests)
    delete newWaitingRequests[action.userId]
    setWaitingRequests(newWaitingRequests)
  }

  useEffect(() => {
    setPending(true)
    Promise.all([
      fetchParty(partyId).then((partyResponse: any) => {
        setParty(partyResponse)
        return partyResponse
      }),
      fetchUser(currentUserId).then((userResponse) => {
        setUser(userResponse)
        return userResponse
      }),
    ])
      .then((responseArr) =>
        Promise.all([
          fetchUser(responseArr[0].author).then((responseAuthor) =>
            setAuthor(responseAuthor),
          ),
          fetchUsers(responseArr[0].guests).then((users) => setGuests(users)),
          fetchUsers(responseArr[0].waitingRequests).then((users) =>
            setWaitingRequests(users),
          ),
          fetchUsers(responseArr[0].rejectedRequests).then((users) =>
            setRejectedRequests(users),
          ),
        ]),
      )
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }, [partyId, currentUserId])

  if (pending) {
    return <PagePreloader />
  }

  if (!party) {
    return <PageNotFound />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <section className={styles.partyContainer}>
      <ImgLink
        to={'/party/' + partyId}
        imageName={party.imageName}
        className={styles.partyHeader}
      >
        <h2 className={styles.partyName}>{party.name}</h2>
      </ImgLink>
      <div className={styles.partyBody}>
        <div className={styles.partyActions}>
          <ParticipateButton
            party={party}
            user={user}
            setConnection={setConnection}
          />
          <ParticipantsList participants={[author, ...Object.values(guests)]} />
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
            waitingRequests={waitingRequests}
            rejectedRequests={rejectedRequests}
            party={party}
            setConnection={setConnection}
          />
        ) : null}
      </div>
    </section>
  )
}

export default PartyPage
