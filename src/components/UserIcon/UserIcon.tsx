import React, { useEffect, useState } from 'react'
import firebaseApp from '../../firebaseApp'
import ImgLink from '../ImgLink/ImgLink'

type Props = {
  userId: string
  className: string
}

const UserIcon: React.FC<Props> = ({ userId, ...rest }) => {
  const [imageName, setImageName] = useState('')
  const [pending, setPending] = useState(true)

  function fetchUserData() {
    setPending(true)
    firebaseApp
      .database()
      .ref('users/' + userId)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        setImageName(data['imageName'])
      })
      .catch((err) => console.log(err))
      .finally(() => setPending(false))
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return pending ? null : (
    <ImgLink to={'/user/' + userId} {...rest} imgName={imageName} />
  )
}

export default UserIcon
