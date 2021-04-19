import React from 'react'
import styles from './DetailedParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import UserLabel from '../../components/UserLabel/UserLabel'

type Props = {
  authorId: string
  guestsIDs: string[]
}

const DetailedParticipantsList: React.FC<Props> = ({ authorId, guestsIDs }) => {
  return (
    <>
      <h2>Participants ({guestsIDs.length + 1})</h2>
      <ul className={styles.detailedParticipantsList}>
        <li className={styles.detailedListItem}>
          <img className={styles.crown} src={crownImageSRC} alt={'guestImg'} />
          <UserLabel
            className={styles.userLabelDetailed}
            userId={authorId}
            detailed={true}
          ></UserLabel>
        </li>
        {guestsIDs.map((id) => (
          <li className={styles.detailedListItem}>
            <UserLabel
              className={styles.userLabelDetailed}
              userId={id}
              detailed={true}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

export default DetailedParticipantsList
