import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import firebaseApp from '../../firebaseApp'
import preloaderImgURL from '../../images/preloader.gif'
import imageNotFound from '../../images/imageNotFound.jpg'

type Props = {
  to: string
  imgName: string
  className: string
}

const ImgLink: React.FC<Props> = ({ to, imgName, ...rest }) => {
  const [url, setUrl] = useState(`url(${preloaderImgURL})`)

  useEffect(() => {
    try {
      const ref = firebaseApp.storage().ref('images').child(imgName)
      ref
        .getDownloadURL()
        .then((url) => {
          setUrl(`url(${url})`)
        })
        .catch(() => {
          setUrl(`url(${imageNotFound})`)
        })
    } catch {
      setUrl(`url(${imageNotFound})`)
    }
  }, [imgName])

  return <Link to={to} {...rest} style={{ backgroundImage: url }} />
}

export default ImgLink
