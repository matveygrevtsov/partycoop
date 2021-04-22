import React from 'react'
import { Link } from 'react-router-dom'
import noImageSelected from '../../images/noImageSelected.png'

type Props = {
  to: string
  imageName: string
  className: string
}

const ImgLink: React.FC<Props> = ({ to, imageName, ...rest }) => {
  const url = imageName ? imageName : noImageSelected
  return (
    <Link to={to} {...rest} style={{ backgroundImage: 'url(' + url + ')' }} />
  )
}

export default ImgLink
