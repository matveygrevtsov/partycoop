import React, { useState } from 'react'
import styles from './ParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import DetailedParticipantsList from '../DetailedParticipantsList/DetailedParticipantsList'
import ImgLink from '../ImgLink/ImgLink'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ParticipantsList: React.FC<any> = ({ participants }) => {
  const [showDetailedList, setShowDetailedList] = useState(false)
  return (
    <>
      <ul className={styles.partyParticipants}>
        {participants.slice(0, 4).map((participant: any, index: number) => (
          <li key={participant.id}>
            {index === 0 ? (
              <img
                className={styles.crown}
                src={crownImageSRC}
                alt={'partyAuthor'}
              />
            ) : null}
            <ImgLink
              to={'/user/' + participant.id}
              imageName={participant.imageName}
              className={styles.partyParticipant}
            />
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
          <FontAwesomeIcon size="3x" className={styles.iconFontAwesome} icon={faTimes} />
        </button>
        <DetailedParticipantsList participants={participants} />
      </div>
    </>
  )
}

export default ParticipantsList
