import React, { useEffect, useState } from 'react'
import firebaseApp from '../../firebaseApp'
import ImgLink from '../ImgLink/ImgLink'
import styles from './UserLabel.module.css'

type Props = {
  userId: string
  className: string
  detailed?: boolean
}

const UserLabel: React.FC<Props> = ({ userId, detailed, ...rest }) => {
  const [imageName, setImageName] = useState('')
  const [pending, setPending] = useState(true)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    function fetchUserData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('users/' + userId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setImageName(data['imageName'])
          setFullName(data['fullName'])
        })
        .catch((err) => console.log(err))
        .finally(() => setPending(false))
    }
    fetchUserData()
  }, [userId])

  if (pending) {
    return null
  }

  if (detailed) {
    return (
      <>
        <ImgLink to={'/user/' + userId} imgName={imageName} {...rest} />
        <span className={styles.userDetailedDescription}>{fullName}</span>
      </>
    )
  }

  return <ImgLink to={'/user/' + userId} {...rest} imgName={imageName} />
}

export default UserLabel
