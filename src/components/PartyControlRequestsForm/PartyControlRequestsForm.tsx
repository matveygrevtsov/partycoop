import React from 'react'
import styles from './PartyControlRequestsForm.module.css'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import ImgLink from '../ImgLink/ImgLink'

// waitingRequests, rejectedRequests - это объекты, у которых ключи - айдишники

const PartyControlRequestsForm: React.FC<any> = ({
  handleAction,
  party,
  waitingRequests,
  rejectedRequests,
}) => {
  const handleAccept = async (event: any) => {
    const acceptedUserId = event.target.id
    try {
      await (() => {
        updateData('parties', party.id, {
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== acceptedUserId,
          ),
          guests: [acceptedUserId, ...party.guests],
        })

        updateData('users', acceptedUserId, {
          participation: [
            party.id,
            ...(waitingRequests[acceptedUserId].participation || []),
          ],
          waitingRequests: waitingRequests[
            acceptedUserId
          ].waitingRequests.filter((id: string) => id !== party.id),
        })
      })()
      handleAction({ type: 'accept', userId: acceptedUserId })
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (event: any) => {
    const rejectedUserId = event.target.id
    try {
      await (() => {
        updateData('parties', party.id, {
          waitingRequests: party.waitingRequests.filter(
            (id: string) => id !== rejectedUserId,
          ),
          rejectedRequests: [rejectedUserId, ...party.rejectedRequests],
        })

        updateData('users', rejectedUserId, {
          rejectedRequests: [
            party.id,
            ...(waitingRequests[rejectedUserId].rejectedRequests || []),
          ],
          waitingRequests: waitingRequests[
            rejectedUserId
          ].waitingRequests.filter((id: string) => id !== party.id),
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
                className={styles.acceptRequestsBtn}
                id={id}
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
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
