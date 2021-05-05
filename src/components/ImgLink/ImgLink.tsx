import React from 'react'
import { Link } from 'react-router-dom'
import noImageSelected from '../../images/noImageSelected.png'

interface ImgLinkInterface {
  to: string
  imageName: string
  doNotShowLink?: boolean
  className: string
}

const ImgLink: React.FC<ImgLinkInterface> = ({
  to,
  imageName,
  doNotShowLink,
  ...rest
}) => {
  const url = imageName ? imageName : noImageSelected
  if (doNotShowLink) {
    return <div {...rest} style={{ backgroundImage: 'url(' + url + ')' }} />
  }
  return (
    <Link to={to} {...rest} style={{ backgroundImage: 'url(' + url + ')' }} />
  )
}

export default ImgLink
