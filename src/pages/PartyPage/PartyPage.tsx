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
  const [partyExists, setPartyExists] = useState(false)

  const participateHandle = () => {
    setUser({
      ...user,
      waitingRequests: [partyId, ...user.waitingRequests],
    })
    setParty({
      ...party,
      waitingRequests: [currentUserId, ...party.waitingRequests],
    })
    setWaitingRequests({
      [currentUserId]: user,
      ...waitingRequests,
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
      }),
      fetchUser(currentUserId).then((userResponse) => {
        setUser(userResponse)
      }),
    ])
      .then(() => setPartyExists(true))
      .finally(() => setPending(false))
  }, [partyId, currentUserId])

  useEffect(() => {
    setPending(true)
    if (partyExists) {
      Promise.all([
        fetchUser(party.author).then((responseAuthor) =>
          setAuthor(responseAuthor),
        ),
        fetchUsers(party.guests).then((users) => setGuests(users)),
        fetchUsers(party.waitingRequests).then((users) =>
          setWaitingRequests(users),
        ),
        fetchUsers(party.rejectedRequests).then((users) =>
          setRejectedRequests(users),
        ),
      ]).finally(() => setPending(false))
    }
  }, [partyExists, party])

  if (pending) {
    return <PagePreloader />
  }

  if (!partyExists) {
    return <PageNotFound />
  }

  return (
    <section className={styles.partyCard}>
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
            actionHandle={participateHandle}
            party={party}
            user={user}
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
          />
        ) : null}
      </div>
    </section>
  )
}

export default PartyPage
