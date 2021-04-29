import styles from './NavBar.module.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons'
import logo from '../../images/logo.png'
import React, { useContext } from 'react'
import firebase from '../../firebaseApp'
import { AuthContext } from '../../Auth'

const NavBar: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  return (
    <nav className={styles.navbar}>
      <NavLink
        activeClassName={styles.activeNavLink}
        className={styles.navLink}
        to="/settings"
      >
        <span className={styles.navLinkName}>My account</span>
        <FontAwesomeIcon
          className={styles.iconFontAwesome}
          icon={faAddressCard}
        />
      </NavLink>
      <NavLink
        activeClassName={styles.activeNavLink}
        className={styles.navLink}
        to="/requests"
      >
        <span className={styles.navLinkName}>My requests</span>
        <FontAwesomeIcon className={styles.iconFontAwesome} icon={faClock} />
      </NavLink>
      <NavLink
        activeClassName={styles.activeNavLink}
        className={styles.navLink}
        to={'/organized_and_participation/' + currentUserId}
      >
        <span className={styles.navLinkName}>My parties</span>
        <FontAwesomeIcon className={styles.iconFontAwesome} icon={faCrown} />
      </NavLink>
      <NavLink
        activeClassName={styles.activeNavLink}
        className={styles.navLink}
        to="/allparties"
      >
        <span className={styles.navLinkName}>All parties</span>
        <FontAwesomeIcon
          className={styles.iconFontAwesome}
          icon={faGlobeEurope}
        />
      </NavLink>
      <button
        className={styles.signOutBtn}
        onClick={() => firebase.auth().signOut()}
      >
        <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
      </button>

      <img className={styles.navLogo} src={logo} alt="Logo" />
    </nav>
  )
}

export default NavBar
