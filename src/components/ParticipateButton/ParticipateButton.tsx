import React, { useState } from 'react'
import Button from '../Button/Button'
import firebaseApp from '../../firebaseApp'
import styles from './ParticipateButton.module.css'

const ParticipateButton: React.FC<any> = ({ party, user, actionHandle }) => {
  const [pending, setPending] = useState(false)

  const participateActionHandle = async () => {
    setPending(true)
    try {
      await (() => {
        firebaseApp
          .database()
          .ref('parties/' + party.id)
          .update({
            waitingRequests: [user.id, ...(party.waitingRequests || [])],
          })

        firebaseApp
          .database()
          .ref('users/' + user.id)
          .update({
            waitingRequests: [party.id, ...(user.waitingRequests || [])],
          })
      })()
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
      actionHandle()
    }
  }

  if (party.waitingRequests.includes(user.id)) {
    return <span className={styles.greenText}>Your request has been sent!</span>
  }
  if (party.guests.includes(user.id)) {
    return <span className={styles.greenText}>You are a guest!</span>
  }
  if (party.waitingRequests.includes(user.id)) {
    return <span className={styles.greenText}>Your request has been sent!</span>
  }
  if (party.author === user.id) {
    return <span className={styles.greenText}>You are the author!</span>
  }
  if (party.rejectedRequests.includes(user.id)) {
    return (
      <span className={styles.redText}>
        Unfortunately, your request has been rejected!
      </span>
    )
  }
  if (user.age < party.ageInterval[0] || user.age > party.ageInterval[1]) {
    return (
      <p className={styles.redText}>
        Unfortunately, you are not in the age range!
      </p>
    )
  }

  if (party.guests.length === party.guestsNumberInterval[1]) {
    return (
      <p className={styles.redText}>
        Unfortunately, there are too many participants!
      </p>
    )
  }

  return (
    <Button
      pending={pending}
      onClick={participateActionHandle}
      text={'participate!'}
    />
  )
}

export default ParticipateButton
