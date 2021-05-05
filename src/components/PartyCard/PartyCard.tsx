import React, { useEffect, useState } from 'react'
import styles from './PartyCard.module.css'
import ImgLink from '../ImgLink/ImgLink'
import Preloader from '../Preloader/Preloader'
import ParticipantsList from '../ParticipantsList/ParticipantsList'
import { fetchParty, fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import { Party, User } from '../../DataTypes'

interface PartyCardInterface {
  partyId: string
  setConnection: (connectionStatus: boolean) => void
}

const PartyCard: React.FC<PartyCardInterface> = (props) => {
  const [party, setParty] = useState<Party | null>(null)
  const [pending, setPending] = useState(true)
  const [participants, setParticipants] = useState<User[]>([])

  useEffect(() => {
    setPending(true)
    let isMounted = true
    fetchParty(props.partyId)
      .then((partyResponse: Party) => {
        if (isMounted) {
          setParty(partyResponse)
          return Promise.all(
            [partyResponse.author, ...partyResponse.guests].map((id: string) =>
              fetchUser(id),
            ),
          )
        }
        return null
      })
      .then((participantsResponse: User[] | null) => {
        if (isMounted && participantsResponse) {
          setParticipants(participantsResponse)
          setPending(false)
        }
      })
      .catch(() => props.setConnection(false))
    return () => {
      isMounted = false
    }
  }, [props])

  if (pending) {
    return <Preloader />
  }

  return (
    <ImgLink
      to={'/party/' + props.partyId}
      imageName={party!.imageName}
      className={styles.partyCard}
    >
      <h2 className={styles.partyName}>{party!.name}</h2>
      <div className={styles.partyInfo}>
        <ParticipantsList
          doNotDisplayLinks={true}
          participants={participants}
        />
      </div>
    </ImgLink>
  )
}

export default React.memo(PartyCard)
