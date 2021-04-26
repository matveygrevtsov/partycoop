import React from 'react'
import styles from './DetailedParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import ImgLink from '../ImgLink/ImgLink'

const DetailedParticipantsList: React.FC<any> = ({ participants }) => {
  return (
    <>
      <h2>Participants ({participants.length})</h2>
      <ul className={styles.detailedParticipantsList}>
        {participants.map((participant: any, index: number) => (
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

export default DetailedParticipantsList
