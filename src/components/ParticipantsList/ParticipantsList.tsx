import React, { useState } from 'react'
import styles from './ParticipantsList.module.css'
import crownImageSRC from '../../images/crown.png'
import DetailedParticipantsList from '../DetailedParticipantsList/DetailedParticipantsList'
import ImgLink from '../ImgLink/ImgLink'
import { User } from '../../DataTypes'

interface ParticipantsListInterface {
  participants: User[]
  doNotDisplayLinks?: boolean
}

const ParticipantsList: React.FC<ParticipantsListInterface> = (props) => {
  const [showDetailedList, setShowDetailedList] = useState(false)
  return (
    <>
      <ul className={styles.partyParticipants}>
        {props.participants
          .slice(0, 4)
          .map((participant: User, index: number) => (
            <li key={'ParticipantsList' + participant.id}>
              {index === 0 ? (
                <img
                  className={styles.crown}
                  src={crownImageSRC}
                  alt={'partyAuthor'}
                />
              ) : null}
              <ImgLink
                doNotShowLink={props.doNotDisplayLinks}
                to={'/user/' + participant.id}
                imageName={participant.imageName}
                className={styles.partyParticipant}
              />
            </li>
          ))}

        {!props.doNotDisplayLinks ? (
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

        {props.doNotDisplayLinks && props.participants.length > 4 ? (
          <li>
            <button
              onClick={() => setShowDetailedList(!showDetailedList)}
              className={styles.remainingGuestsBtn}
            >
              +{props.participants.length - 4}
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

        {props.doNotDisplayLinks ? null : (
          <DetailedParticipantsList participants={props.participants} />
        )}
      </div>
    </>
  )
}

export default React.memo(ParticipantsList)
