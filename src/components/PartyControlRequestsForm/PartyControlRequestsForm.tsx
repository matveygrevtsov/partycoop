import React, { useState } from 'react'
import styles from './PartyControlRequestsForm.module.css'
import {
  acceptWaitingRequest,
  rejectWaitingRequest,
} from '../../firebaseAPIhelpers/updateDataFunctions'
import ImgLink from '../ImgLink/ImgLink'
import { Party, UsersObject } from '../../DataTypes'

interface PartyControlRequestsFormInterface {
  handleAction: (action: object) => void
  party: Party
  waitingRequests: UsersObject
  rejectedRequests: UsersObject
  setConnection: (connectionStatus: boolean) => void
}

const PartyControlRequestsForm: React.FC<PartyControlRequestsFormInterface> = (
  props,
) => {
  const [pending, setPending] = useState(false)

  const handleAccept = (event: any) => {
    setPending(true)
    const acceptedUserId = event.target.id
    acceptWaitingRequest(props.party, props.waitingRequests[acceptedUserId])
      .then(
        () => props.handleAction({ type: 'accept', userId: acceptedUserId }),
        () => props.setConnection(false),
      )
      .finally(() => setPending(false))
  }

  const handleReject = (event: any) => {
    setPending(true)
    const rejectedUserId = event.target.id
    rejectWaitingRequest(props.party, props.waitingRequests[rejectedUserId])
      .then(
        () => props.handleAction({ type: 'reject', userId: rejectedUserId }),
        () => props.setConnection(false),
      )
      .finally(() => setPending(false))
  }

  return (
    <div className={styles.partyControlRequestsFormContainer}>
      <h2>Requests list</h2>
      <h3>Waiting ({Object.keys(props.waitingRequests).length})</h3>
      <ul className={styles.waitingRequestsList}>
        {Object.keys(props.waitingRequests).map((id: string) => {
          const user = props.waitingRequests[id]
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
      <h3>Rejected ({Object.keys(props.rejectedRequests).length})</h3>

      <ul className={styles.rejectedRequests}>
        {Object.keys(props.rejectedRequests).map((id: string) => {
          const user = props.rejectedRequests[id]
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

export default React.memo(PartyControlRequestsForm)
