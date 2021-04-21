import React, { useEffect, useState } from 'react'
import styles from './PartyCard.module.css'
import ImgLink from '../ImgLink/ImgLink'
import firebaseApp from '../../firebaseApp'
import Preloader from '../Preloader/Preloader'
import ParticipantsList from '../ParticipantsList/ParticipantsList'

const PartyCard: React.FC<any> = ({ partyId }) => {
  const [party, setParty]: any = useState({})
  const [pending, setPending] = useState(true)

  useEffect(() => {
    function fetchParty() {
      setPending(true)
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setParty({
            imageName: data.imageName,
            name: data.name,
            author: data.author,
            guests: data.guests ? data.guests : [],
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => setPending(false))
    }
    fetchParty()
  }, [partyId])

  if (pending) {
    return <Preloader />
  }

  return (
    <ImgLink
      to={'/party/' + partyId}
      imgName={party.imageName}
      className={styles.partyCard}
    >
      <div className={styles.partyInfo}>
        <h2>{party.name}</h2>
        <ParticipantsList authorId={party.author} guestsIDs={party.guests} />
      </div>
    </ImgLink>
  )
}

export default PartyCard
