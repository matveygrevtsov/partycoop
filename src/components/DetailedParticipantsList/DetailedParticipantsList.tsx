import React from 'react'
import styles from './DetailedParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import ImgLink from '../ImgLink/ImgLink'
import { User } from '../../DataTypes'

const DetailedParticipantsList: React.FC<{ participants: User[] }> = (
  props,
) => {
  return (
    <>
      <div className={styles.detailedParticipantsListHeader}>
        Participants ({props.participants.length})
      </div>
      <ul className={styles.detailedParticipantsList}>
        {props.participants.map((participant: User, index: number) => (
          <li
            key={'DetailedParticipantsList' + participant.id}
            className={styles.detailedListItem}
          >
            {index === 0 ? (
              <img className={styles.crown} src={crownImageSRC} alt="guest" />
            ) : null}
            <ImgLink
              to={'/user/' + participant.id}
              imageName={participant.imageName}
              className={styles.userLabelDetailed}
            />
            <span className={styles.userDetailedDescription}>
              {participant.fullName}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default React.memo(DetailedParticipantsList)
