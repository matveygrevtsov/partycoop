import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import { Link } from 'react-router-dom'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')
  const [pending, setPending] = useState(false)
  const [connection, setConnection] = useState(true)
  const [user, setUser] = useState({
    email: '',
    fullName: '',
    age: '',
    aboutMe: '',
    passwordLength: 0,
  })

  const inputDataWarning = (user: any) => {
    if (!user.email) {
      return 'Empty email'
    }

    if (!user.email.includes('@')) {
      return 'Please enter a valid email'
    }

    if (user.passwordLength < 6) {
      return 'Your password must contain at least 6 characters'
    }

    if (!user.fullName) {
      return 'Empty Fullname'
    }

    if (/\d/g.test(user.fullName)) {
      return 'Numbers are not allowed in the Fullname'
    }

    if (!user.age) {
      return 'Empty age'
    }

    if (Number(user.age) < 0) {
      return 'Wrong age'
    }

    if (!user.aboutMe) {
      return 'Empty about you information'
    }
    return ''
  }

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setErrorText(inputDataWarning(user)),
      100,
    )
    return () => clearTimeout(timeOutId)
  }, [user])

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()

      const { email, password, fullName, age, aboutMe } = event.target.elements

      const warning = inputDataWarning({
        email: email.value,
        passwordLength: password.value.length,
        fullName: fullName.value,
        age: age.value,
        aboutMe: aboutMe.value,
      })
      if (warning !== '') {
        setErrorText(warning)
        return
      }

      setPending(true)

      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential: any) =>
          createDocument('users', userCredential.user?.uid, {
            id: userCredential.user?.uid,
            fullName: fullName.value.trim(),
            age: Number(age.value),
            aboutMe: aboutMe.value.trim(),
          }),
        )
        .then(() => history.push('/settings'))
        .catch(() => setConnection(false))
        .finally(() => setPending(false))
    },
    [history],
  )

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <section className={styles.signUpSection}>
      <CenterLogo />
      <form className={styles.signUpForm} onSubmit={handleSignUp}>
        <input
          autoComplete="off"
          required
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
        />

        <input
          autoComplete="off"
          required
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event) =>
            setUser({ ...user, passwordLength: event.target.value.length })
          }
        />

        <input
          autoComplete="off"
          required
          type="text"
          className={styles.inputText}
          name="fullName"
          placeholder="Fullname"
          value={user.fullName}
          onChange={(event) =>
            setUser({ ...user, fullName: event.target.value })
          }
        />

        <input
          autoComplete="off"
          required
          type="number"
          className={styles.inputText}
          name="age"
          placeholder="Age"
          min="0"
          max="100"
          value={user.age}
          onChange={(event) => setUser({ ...user, age: event.target.value })}
        />

        <textarea
          autoComplete="off"
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
          required
          className={styles.aboutMeArea}
          value={user.aboutMe}
          onChange={(event) =>
            setUser({ ...user, aboutMe: event.target.value })
          }
        />

        <p className={styles.errorText}>{errorText}</p>

        <button
          disabled={errorText !== ''}
          className={styles.submitBtn}
          type="submit"
        >
          Sign Up
        </button>

        <br />
        <br />

        <div className={styles.otherActions}>
          <Link to="./signin" className={styles.signUp}>
            Sign In
          </Link>
        </div>
      </form>
    </section>
  )
}

export default withRouter(SignUp)
