import React from 'react'
import styles from './ParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import UserIcon from '../../components/UserIcon/UserIcon'

// замечание: если слишком много гостей, то всех не отображать!

type Props = {
  authorId: string
  guestsIDs: string[]
}

const ParticipantsList: React.FC<Props> = ({ authorId, guestsIDs }) => {
  return (
    <ul className={styles.partyParticipants}>
      <li key={authorId}>
        <img className={styles.crown} src={crownImageSRC} alt={'guestImg'} />
        <UserIcon userId={authorId} className={styles.partyParticipant} />
      </li>
      {guestsIDs.map((id: string) => (
        <li key={id}>
          <UserIcon userId={id} className={styles.partyParticipant} />
        </li>
      ))}
    </ul>
  )
}

export default ParticipantsList
