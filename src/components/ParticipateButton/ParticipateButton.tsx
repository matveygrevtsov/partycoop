import React, { useState } from 'react'
import Button from '../Button/Button'
import styles from './ParticipateButton.module.css'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import { Party, User } from '../../DataTypes'

const ParticipateButton: React.FC<{
  party: Party
  user: User
  setConnection: (connectionStatus: boolean) => void
}> = ({ party, user, setConnection }) => {
  const [status, setStatus] = useState('active')

  const participateActionHandle = () => {
    setStatus('pending')
    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: [user.id, ...party.waitingRequests],
      }),
      updateData('users', user.id, {
        waitingRequests: [party.id, ...user.waitingRequests],
      }),
    ])
      .then(() => setStatus('submited'))
      .catch(() => setConnection(false))
  }

  if (status === 'submited' || party.waitingRequests.includes(user.id)) {
    return <span className={styles.greenText}>Your request has been sent!</span>
  }
  if (party.guests.includes(user.id)) {
    return <span className={styles.greenText}>You are a guest!</span>
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
      pending={status === 'pending'}
      onClick={participateActionHandle}
      text={'participate!'}
    />
  )
}

export default ParticipateButton
