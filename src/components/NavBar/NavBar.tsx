import styles from './NavBar.module.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import logo from '../../images/logo.png'
import React from 'react'

const SideMenu: React.FC<any> = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink activeClassName={styles.activeNavLink} className={styles.navLink} to="/settings">
        <span className={styles.navLinkName}>My account</span>
        <FontAwesomeIcon
          className={styles.iconFontAwesome}
          icon={faAddressCard}
        />
      </NavLink>
      <NavLink activeClassName={styles.activeNavLink} className={styles.navLink} to="/requests">
        <span className={styles.navLinkName}>My requests</span>
        <FontAwesomeIcon className={styles.iconFontAwesome} icon={faClock} />
      </NavLink>
      <NavLink activeClassName={styles.activeNavLink} className={styles.navLink} to="/parties">
        <span className={styles.navLinkName}>My parties</span>
        <FontAwesomeIcon className={styles.iconFontAwesome} icon={faCrown} />
      </NavLink>
      <NavLink activeClassName={styles.activeNavLink} className={styles.navLink} to="/search">
        <span className={styles.navLinkName}>Search</span>
        <FontAwesomeIcon className={styles.iconFontAwesome} icon={faSearch} />
      </NavLink>

      <img className={styles.navLogo} src={logo} alt="Logo" />
    </nav>
  )
}

export default SideMenu
