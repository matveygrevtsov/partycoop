import React, { useEffect, useState } from 'react'
import styles from './PartyCard.module.css'
import ImgLink from '../ImgLink/ImgLink'
import Preloader from '../Preloader/Preloader'
import ParticipantsList from '../ParticipantsList/ParticipantsList'
import { fetchParty, fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'

const PartyCard: React.FC<any> = ({ partyId, setConnection }) => {
  const [party, setParty]: any = useState(null)
  const [pending, setPending] = useState(true)
  const [participants, setParticipants]: any = useState([])

  useEffect(() => {
    setPending(true)
    fetchParty(partyId)
      .then((partyResponse: any) => {
        setParty(partyResponse)
        return Promise.all(
          [partyResponse.author, ...partyResponse.guests].map((id: string) =>
            fetchUser(id),
          ),
        )
      })
      .then((participantsResponse: any) => {
        setParticipants(participantsResponse)
        setPending(false)
      })
      .catch(() => setConnection(false))
  }, [partyId, setConnection])

  if (pending) {
    return <Preloader />
  }

  return (
    <ImgLink
      to={'/party/' + partyId}
      imageName={party.imageName}
      className={styles.partyCard}
    >
      <h2 className={styles.partyName}>{party.name}</h2>
      <div className={styles.partyInfo}>
        <ParticipantsList participants={participants} />
      </div>
    </ImgLink>
  )
}

export default PartyCard
