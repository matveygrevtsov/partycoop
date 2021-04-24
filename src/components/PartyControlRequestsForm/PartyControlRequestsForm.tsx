import React, { useState } from 'react'
import styles from './PartyControlRequestsForm.module.css'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import ImgLink from '../ImgLink/ImgLink'

// waitingRequests, rejectedRequests - это объекты, у которых ключи - айдишники

const PartyControlRequestsForm: React.FC<any> = ({
  handleAction,
  party,
  waitingRequests,
  rejectedRequests,
  setConnection,
}) => {
  const [pending, setPending] = useState(false)

  const handleAccept = (event: any) => {
    setPending(true)
    const acceptedUserId = event.target.id

    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: party.waitingRequests.filter(
          (id: string) => id !== acceptedUserId,
        ),
        guests: [acceptedUserId, ...party.guests],
      }),
      updateData('users', acceptedUserId, {
        participation: [
          party.id,
          ...(waitingRequests[acceptedUserId].participation || []),
        ],
        waitingRequests: waitingRequests[acceptedUserId].waitingRequests.filter(
          (id: string) => id !== party.id,
        ),
      }),
    ])
      .then(() => handleAction({ type: 'accept', userId: acceptedUserId }))
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }

  const handleReject = async (event: any) => {
    setPending(true)
    const rejectedUserId = event.target.id

    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: party.waitingRequests.filter(
          (id: string) => id !== rejectedUserId,
        ),
        rejectedRequests: [rejectedUserId, ...party.rejectedRequests],
      }),

      updateData('users', rejectedUserId, {
        rejectedRequests: [
          party.id,
          ...(waitingRequests[rejectedUserId].rejectedRequests || []),
        ],
        waitingRequests: waitingRequests[rejectedUserId].waitingRequests.filter(
          (id: string) => id !== party.id,
        ),
      }),
    ])
      .then(() => handleAction({ type: 'reject', userId: rejectedUserId }))
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }

  return (
    <>
      <h2>Requests list</h2>
      <h3>Waiting ({Object.keys(waitingRequests).length})</h3>
      <ul className={styles.requestsList}>
        {Object.keys(waitingRequests).map((id: any) => {
          const user = waitingRequests[id]
          return (
            <li key={id}>
              <ImgLink
                to={'/user/' + id}
                imageName={user.imageName}
                className={styles.requestIcon}
              />
              <button
                disabled={pending}
                className={styles.acceptRequestsBtn}
                id={id}
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                disabled={pending}
                className={styles.rejectedRequestsBtn}
                id={id}
                onClick={handleReject}
              >
                Reject
              </button>
            </li>
          )
        })}
      </ul>
      <h3>Rejected ({Object.keys(rejectedRequests).length})</h3>

      <ul className={styles.requestsList}>
        {Object.keys(rejectedRequests).map((id: string) => {
          const user = rejectedRequests[id]
          return (
            <li key={id}>
              <ImgLink
                to={'/user/' + id}
                imageName={user.imageName}
                className={styles.requestIcon}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default PartyControlRequestsForm
