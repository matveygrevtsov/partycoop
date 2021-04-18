import React, { useCallback, useContext, useState } from 'react'
import { withRouter, Redirect } from 'react-router'
import firebaseApp from '../../firebaseApp'
import { AuthContext } from '../../Auth'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import styles from './SignIn.module.css'
import { Link } from 'react-router-dom'

const SignIn: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')

  const handleSignIn = useCallback(
    async (event) => {
      event.preventDefault()
      const { email, password } = event.target.elements
      try {
        await firebaseApp
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
        history.push('/')
      } catch (error) {
        setErrorText(String(error))
      }
    },
    [history],
  )

  const handleInputChange = () => setErrorText('')

  const { currentUser } = useContext(AuthContext)

  if (currentUser) {
    return <Redirect to="/" />
  }

  return (
    <section className={styles.signInSection}>
      <CenterLogo />
      <form className={styles.signInForm} onSubmit={handleSignIn}>
        <input
          required
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <input
          required
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <br />

        <p className={styles.errorText}>{errorText}</p>

        <button className={styles.submitBtn} type="submit">
          Log in
        </button>
        <br />
        <br />
        <div className={styles.otherActions}>
          <Link to="./signup" className={styles.signUp} href="#">
            Sign Up
          </Link>
        </div>
      </form>
    </section>
  )
}

export default withRouter(SignIn)
