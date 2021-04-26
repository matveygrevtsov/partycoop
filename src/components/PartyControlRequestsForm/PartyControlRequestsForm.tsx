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

  const handleReject = (event: any) => {
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
          ...waitingRequests[rejectedUserId].rejectedRequests,
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
    <div className={styles.partyControlRequestsFormContainer}>
      <h2>Requests list</h2>
      <h3>Waiting ({Object.keys(waitingRequests).length})</h3>
      <ul className={styles.waitingRequestsList}>
        {Object.keys(waitingRequests).map((id: any) => {
          const user = waitingRequests[id]
          return (
            <li key={'AcceptOrReject' + id}>
              <ImgLink
                to={'/user/' + id}
                imageName={user.imageName}
                className={styles.requestIcon}
              />
              <div className={styles.selectActionRequest}>
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
                <br />
                <span>{user.fullName}</span>
              </div>
            </li>
          )
        })}
      </ul>
      <h3>Rejected ({Object.keys(rejectedRequests).length})</h3>

      <ul className={styles.rejectedRequests}>
        {Object.keys(rejectedRequests).map((id: string) => {
          const user = rejectedRequests[id]
          return (
            <li>
              <ImgLink
                key={'rejectedUser' + id}
                to={'/user/' + id}
                imageName={user.imageName}
                className={styles.requestIcon}
              />
              <div className={styles.selectActionRequest}>{user.fullName}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PartyControlRequestsForm
