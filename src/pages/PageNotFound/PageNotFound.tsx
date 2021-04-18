import React from 'react'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import styles from './PageNotFound.module.css'

const PageNotFound: React.FC<any> = () => {
  return (
    <section className={styles.pageNotFound}>
      <CenterLogo />
      <h2>404</h2>
      <span>Page not found</span>
    </section>
  )
}

export default PageNotFound
