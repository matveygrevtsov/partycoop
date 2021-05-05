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
import { Party, User, UsersObject } from '../../DataTypes'

const PartyPage: React.FC<any> = ({ match }) => {
  const { userData } = useContext(AuthContext)
  const partyId = match.params.partyId
  const [party, setParty] = useState<Party | null>(null)
  const [guests, setGuests] = useState<UsersObject>({})
  const [waitingRequests, setWaitingRequests] = useState<UsersObject>({})
  const [rejectedRequests, setRejectedRequests] = useState<UsersObject>({})
  const [author, setAuthor] = useState<User | null>(null)
  const [pending, setPending] = useState(true)
  const [connection, setConnection] = useState(true)

  const requestsControlActionHandle = (action: any) => {
    if (!party) {
      return
    }
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
    if (userData.id) {
      fetchParty(partyId)
        .then((partyResponse: Party) => {
          setParty(partyResponse)
          return partyResponse
        })
        .then((partyResponse: Party) =>
          Promise.all([
            fetchUser(partyResponse.author).then((responseAuthor) =>
              setAuthor(responseAuthor),
            ),
            fetchUsers(partyResponse.guests).then((users) => setGuests(users)),
            fetchUsers(partyResponse.waitingRequests).then((users) =>
              setWaitingRequests(users),
            ),
            fetchUsers(partyResponse.rejectedRequests).then((users) =>
              setRejectedRequests(users),
            ),
          ]),
        )
        .catch(() => setConnection(false))
        .finally(() => setPending(false))
    }
  }, [partyId, userData])

  if (pending) {
    return <PagePreloader />
  }

  if (!party) {
    return <PageNotFound />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (!author) {
    return null
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
          <ParticipateButton party={party} setConnection={setConnection} />
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
        {party.author === userData.id ? (
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

export default React.memo(PartyPage)
