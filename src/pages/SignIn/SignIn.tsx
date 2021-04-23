import React, { useCallback, useContext, useEffect, useState } from 'react'
import { withRouter, Redirect } from 'react-router'
import firebaseApp from '../../firebaseApp'
import { AuthContext } from '../../Auth'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import styles from './SignIn.module.css'
import { Link } from 'react-router-dom'

const SignIn: React.FC<any> = ({ history }) => {
  const { currentUser } = useContext(AuthContext)
  const [errorText, setErrorText] = useState('')
  const [email, setEmail] = useState('')
  const [passwordLength, setPasswordLength] = useState(0)
  const [correctInputs, setCorrectInputs] = useState(false)

  const checkInputData = (email: string, passwordLength: number) => {
    setCorrectInputs(false)
    setErrorText('')

    if (!email) {
      return
    }

    if (!email.includes('@')) {
      setErrorText('Please enter a valid email')
      return
    }

    if (passwordLength < 6) {
      return
    }

    setCorrectInputs(true)
    setErrorText('')
  }

  const handleSignIn = useCallback(
    async (event) => {
      event.preventDefault()
      const { email, password } = event.target.elements
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
      () => checkInputData(email, passwordLength),
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
          required
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          autoComplete="off"
          required
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event) => setPasswordLength(event.target.value.length)}
        />
        <br />

        <p className={styles.errorText}>{errorText}</p>

        <button
          disabled={!correctInputs}
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
