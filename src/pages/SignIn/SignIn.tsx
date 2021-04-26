import React, { useCallback, useContext, useEffect, useState } from 'react'
import { withRouter, Redirect } from 'react-router'
import firebaseApp from '../../firebaseApp'
import { AuthContext } from '../../Auth'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import styles from './SignIn.module.css'
import { Link } from 'react-router-dom'

const SignIn: React.FC<any> = ({ history }) => {
  const { currentUser } = useContext(AuthContext)
  const [email, setEmail]: any = useState('')
  const [passwordLength, setPasswordLength]: any = useState(0)
  const [errorText, setErrorText] = useState('')

  const inputDataWarning = (email: string, passwordLength: number) => {
    if (!email && passwordLength < 1) {
      return ' '
    }
    if (!email) {
      return 'Empty email'
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(email.toLowerCase())) {
      return 'Please enter a valid email'
    }
    if (passwordLength < 6) {
      return 'Your password must contain at least 6 characters'
    }
    return ''
  }

  const handleSignIn = useCallback(
    async (event) => {
      event.preventDefault()
      const { email, password } = event.target.elements
      const warning = inputDataWarning(email.value, password.value.length)
      if (warning !== '') {
        setErrorText(warning)
        return
      }
      try {
        await firebaseApp
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
        history.push('/settings')
      } catch (error) {
        setErrorText(String(error))
      }
    },
    [history],
  )

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setErrorText(inputDataWarning(email, passwordLength)),
      100,
    )
    return () => clearTimeout(timeOutId)
  }, [email, passwordLength])

  if (currentUser) {
    return <Redirect to="/settings" />
  }

  return (
    <section className={styles.signInSection}>
      <CenterLogo />
      <form className={styles.signInForm} onSubmit={handleSignIn}>
        <input
          autoComplete="off"
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          autoComplete="off"
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event) => setPasswordLength(event.target.value.length)}
        />
        <br />

        <p className={styles.errorText}>{errorText}</p>

        <button
          disabled={errorText !== ''}
          className={styles.submitBtn}
          type="submit"
        >
          Log in
        </button>
        <br />
        <br />
        <div className={styles.otherActions}>
          <Link to="./signup" className={styles.signUp}>
            Sign Up
          </Link>
        </div>
      </form>
    </section>
  )
}

export default withRouter(SignIn)
