import React from 'react'
import styles from './PartiesList.module.css'
import PartyCard from '../PartyCard/PartyCard'

const PartiesList: React.FC<any> = ({ partiesIDs, setConnection }) => {
  return (
    <div className={styles.resultsGrid}>
      {partiesIDs.map((id: string) => (
        <PartyCard setConnection={setConnection} key={id} partyId={id} />
      ))}
    </div>
  )
}

export default PartiesList
