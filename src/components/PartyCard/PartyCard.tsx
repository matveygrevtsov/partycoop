import React, { useEffect, useState } from 'react'
import styles from './PartyCard.module.css'
import ImgLink from '../ImgLink/ImgLink'
import firebaseApp from '../../firebaseApp'
import Preloader from '../Preloader/Preloader'
import ParticipantsList from '../ParticipantsList/ParticipantsList'

// замечание: у PartyPage и PartyCard одинаковые функции fetch
// мб можно их вынести в одно место ?

const PartyCard: React.FC<any> = ({ partyId }) => {
  const [name, setName] = useState('')
  const [imageName, setImageName] = useState('')
  const [pending, setPending] = useState(true)
  const [authorId, setAuthorId] = useState('')
  const [guestsIds, setGuestsIds] = useState([])

  useEffect(() => {
    function fetchPartyData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('parties/' + partyId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setImageName(data['imageName'])
          setName(data['name'])
          setAuthorId(data['author'])
          const guestsIdsArray = data.guests
          if (guestsIdsArray) {
            setGuestsIds(guestsIdsArray)
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => setPending(false))
    }
    fetchPartyData()
  }, [partyId])

  return pending ? (
    <Preloader />
  ) : (
    <ImgLink
      to={'/party/' + partyId}
      imgName={imageName}
      className={styles.partyCard}
    >
      <div className={styles.partyInfo}>
        <h2>{name}</h2>
        <ParticipantsList authorId={authorId} guestsIDs={guestsIds} />
      </div>
    </ImgLink>
  )
}

export default PartyCard
