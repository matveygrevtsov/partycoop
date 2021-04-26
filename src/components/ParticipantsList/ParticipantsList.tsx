import React, { useState } from 'react'
import styles from './ParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import DetailedParticipantsList from '../DetailedParticipantsList/DetailedParticipantsList'
import ImgLink from '../ImgLink/ImgLink'

const ParticipantsList: React.FC<any> = ({
  participants,
  doNotDisplayLinks,
}) => {
  const [showDetailedList, setShowDetailedList] = useState(false)
  return (
    <>
      <ul className={styles.partyParticipants}>
        {participants.slice(0, 4).map((participant: any, index: number) => (
          <li key={'ParticipantsList' + participant.id}>
            {index === 0 ? (
              <img
                className={styles.crown}
                src={crownImageSRC}
                alt={'partyAuthor'}
              />
            ) : null}
            <ImgLink
              doNotShowLink={doNotDisplayLinks}
              to={'/user/' + participant.id}
              imageName={participant.imageName}
              className={styles.partyParticipant}
            />
          </li>
        ))}

        {!doNotDisplayLinks ? (
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
        ) : null}

        {doNotDisplayLinks && participants.length > 4 ? (
          <li>
            <button
              onClick={() => setShowDetailedList(!showDetailedList)}
              className={styles.remainingGuestsBtn}
            >
              +{participants.length - 4}
            </button>
          </li>
        ) : null}
      </ul>
      <div
        style={showDetailedList ? { display: 'block' } : {}}
        className={styles.detailedListWindow}
      >
        <button
          className={styles.closeListBtn}
          onClick={() => setShowDetailedList(false)}
        />

        {doNotDisplayLinks ? null : (
          <DetailedParticipantsList participants={participants} />
        )}
      </div>
    </>
  )
}

export default ParticipantsList
