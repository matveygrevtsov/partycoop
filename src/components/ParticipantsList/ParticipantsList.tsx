import React, { useState } from 'react'
import styles from './ParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import UserLabel from '../../components/UserLabel/UserLabel'
import DetailedParticipantsList from '../DetailedParticipantsList/DetailedParticipantsList'


type Props = {
  authorId: string
  guestsIDs: string[]
}

const ParticipantsList: React.FC<Props> = ({ authorId, guestsIDs }) => {
  const [showDetailedList, setShowDetailedList] = useState(false)
  return (
    <>
      <ul className={styles.partyParticipants}>
        <li key={authorId}>
          <img className={styles.crown} src={crownImageSRC} alt={'guestImg'} />
          <UserLabel userId={authorId} className={styles.partyParticipant} />
        </li>
        {guestsIDs.slice(0, 3).map((id: string) => (
          <li key={id}>
            <UserLabel userId={id} className={styles.partyParticipant} />
          </li>
        ))}
        <li>
          <button
            onClick={() => setShowDetailedList(!showDetailedList)}
            className={styles.remainingGuestsBtn}
          >
            View
            <br />
            all
          </button>
        </li>
      </ul>
      <div
        style={showDetailedList ? { display: 'block' } : {}}
        className={styles.detailedListWindow}
      >
        <button
          className={styles.closeListBtn}
          onClick={() => setShowDetailedList(false)}
        >
          Close
        </button>
        <DetailedParticipantsList authorId={authorId} guestsIDs={guestsIDs} />
      </div>
    </>
  )
}

export default ParticipantsList
