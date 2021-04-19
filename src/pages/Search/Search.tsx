import React, { useEffect, useState } from 'react'
import styles from './Search.module.css'
import firebaseApp from '../../firebaseApp'
import NavBar from '../../components/NavBar/NavBar'
import PartiesList from '../../components/PartiesList/PartiesList'
import Preloader from '../../components/Preloader/Preloader'

const Search: React.FC<any> = () => {
  const [parties, setParties] = useState([])
  const [pending, setPending] = useState(true)

  function fetchParties() {
    setPending(true)
    firebaseApp
      .database()
      .ref('parties')
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        const partiesIds: any = Object.keys(data)
        setParties(partiesIds)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setPending(false))
  }

  useEffect(() => {
    fetchParties()
  }, [])

  if (pending) {
    return <Preloader />
  }

  return (
    <>
      <NavBar />
      <section className={styles.search}>
        <h2>Search ({parties.length})</h2>
        <PartiesList partiesIDs={parties} />
      </section>
    </>
  )
}

export default Search
