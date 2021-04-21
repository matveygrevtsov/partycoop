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
  const [user, setUser]: any = useState({})
  const [pending, setPending] = useState(true)

  useEffect(() => {
    function fetchUserData() {
      setPending(true)
      firebaseApp
        .database()
        .ref('users/' + userId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setUser({
            imageName: data.imageName,
            fullName: data.fullName,
          })
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
        <ImgLink to={'/user/' + userId} imgName={user.imageName} {...rest} />
        <span className={styles.userDetailedDescription}>{user.fullName}</span>
      </>
    )
  }

  return <ImgLink to={'/user/' + userId} {...rest} imgName={user.imageName} />
}

export default UserLabel
