import React from 'react'
import styles from './PartiesList.module.css'
import PartyCard from '../PartyCard/PartyCard'

type Props = {
  partiesIDs: string[]
}

const PartiesList: React.FC<any> = ({ partiesIDs }) => {
  return (
    <div className={styles.resultsGrid}>
      {partiesIDs.map((id: string) => (
        <PartyCard key={id} partyId={id} />
      ))}
    </div>
  )
}

export default PartiesList
