import React, { useContext, useEffect, useState } from 'react'
import styles from './ParticipateButton.module.css'
import { coloredText, Party } from '../../DataTypes'
import { AuthContext } from '../../Auth'
import { requestForParticipationWarning } from '../../InputDataValidators/InputDataValidators'
import { addWaitingRequest } from '../../firebaseAPIhelpers/updateDataFunctions'

interface ParticipateButtonInterface {
  party: Party
  setConnection: (connectionStatus: boolean) => void
}

const spanWarning = (warning: coloredText) => (
  <span className={styles.textWarning} style={{ color: warning.color }}>
    {warning.text}
  </span>
)

const ParticipateButton: React.FC<ParticipateButtonInterface> = (props) => {
  const { userData, updateCurrentUserData } = useContext(AuthContext)
  const [warning, setWarning] = useState<coloredText>({
    text: '',
    color: '',
  })

  const participateActionHandle = () => {
    setWarning({
      text: 'Loading',
      color: 'black',
    })
    addWaitingRequest(props.party, userData).then(
      () =>
        updateCurrentUserData({
          waitingRequests: [props.party.id, ...userData.waitingRequests],
        }),
      () => props.setConnection(false),
    )
  }

  useEffect(() => {
    if (userData.id) {
      setWarning(requestForParticipationWarning(props.party, userData))
    }
  }, [props.party, userData])

  if (warning!.text) {
    return spanWarning(warning)
  } else if (userData.waitingRequests.includes(props.party.id)) {
    return spanWarning({
      text: 'Loading',
      color: 'black',
    })
  }

  return (
    <button className={styles.participateBtn} onClick={participateActionHandle}>
      participate!
    </button>
  )
}

export default ParticipateButton
