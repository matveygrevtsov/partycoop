import React from 'react'
import styles from './PartiesList.module.css'
import PartyCard from '../PartyCard/PartyCard'

const PartiesList: React.FC<{
  partiesIDs: string[]
  setConnection: (connectionStatus: boolean) => void
}> = (props) => {
  return (
    <div className={styles.resultsGrid}>
      {props.partiesIDs.map((id: string) => (
        <PartyCard
          setConnection={props.setConnection}
          key={String(new Date().getTime()) + id}
          partyId={id}
        />
      ))}
    </div>
  )
}

export default PartiesList
