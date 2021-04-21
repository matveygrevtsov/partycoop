import React from 'react'
import UserLabel from '../UserLabel/UserLabel'
import styles from './PartyControlRequestsForm.module.css'
import firebaseApp from '../../firebaseApp'

const PartyControlRequestsForm: React.FC<any> = ({ handleAction, party }) => {
  const handleAccept = async (event: any) => {
    const acceptedUserId = event.target.value
    try {
      await (() => {
        firebaseApp
          .database()
          .ref('parties/' + party.id)
          .update({
            waitingRequests: party.waitingRequests.filter(
              (id: string) => id !== acceptedUserId,
            ),
            guests: [acceptedUserId, ...party.guests],
          })

        firebaseApp
          .database()
          .ref('users/' + acceptedUserId)
          .once('value')
          .then((snapshot) => {
            const data = snapshot.val()
            return {
              participation: data.participation,
              waitingRequests: data.waitingRequests,
            }
          })
          .then((user) => {
            firebaseApp
              .database()
              .ref('users/' + acceptedUserId)
              .update({
                waitingRequests: user.waitingRequests.filter(
                  (id: string) => id !== party.id,
                ),
                participation: [party.id, ...(user.participation || [])],
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })()
      handleAction({ type: 'accept', userId: acceptedUserId })
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (event: any) => {
    const rejectedUserId = event.target.value
    handleAction({ type: 'reject', userId: rejectedUserId })
    try {
      await (() => {
        firebaseApp
          .database()
          .ref('parties/' + party.id)
          .update({
            waitingRequests: party.waitingRequests.filter(
              (id: string) => id !== rejectedUserId,
            ),
            rejectedRequests: [rejectedUserId, ...party.rejectedRequests],
          })

        firebaseApp
          .database()
          .ref('users/' + rejectedUserId)
          .once('value')
          .then((snapshot) => {
            const data = snapshot.val()
            return {
              rejectedRequests: data.rejectedRequests,
              waitingRequests: data.waitingRequests,
            }
          })
          .then((user) => {
            firebaseApp
              .database()
              .ref('users/' + rejectedUserId)
              .update({
                waitingRequests: user.waitingRequests.filter(
                  (id: string) => id !== party.id,
                ),
                rejectedRequests: [party.id, ...(user.rejectedRequests || [])],
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })()
      handleAction({ type: 'reject', userId: rejectedUserId })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h2>Requests list</h2>
      <h3>Waiting ({party.waitingRequests.length})</h3>
      <ul className={styles.requestsList}>
        {party.waitingRequests.map((userId: string) => (
          <li key={userId}>
            <UserLabel className={styles.UserLabel} userId={userId} />
            <button
              className={styles.acceptRequestsBtn}
              value={userId}
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className={styles.rejectedRequestsBtn}
              value={userId}
              onClick={handleReject}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
      <h3>Rejected ({party.rejectedRequests.length})</h3>

      <ul className={styles.requestsList}>
        {party.rejectedRequests.map((userId: string) => (
          <li key={userId}>
            <UserLabel className={styles.UserLabel} userId={userId} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PartyControlRequestsForm
