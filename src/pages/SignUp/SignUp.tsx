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
    if (
      !user.email &&
      user.passwordLength < 1 &&
      !user.fullName &&
      !user.age &&
      !user.aboutMe
    ) {
      return ' '
    }

    if (!user.email) {
      return 'Empty email'
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(user.email.toLowerCase())) {
      return 'Please enter a valid email'
    }

    if (user.passwordLength < 6) {
      return 'Your password must contain at least 6 characters'
    }

    if (!user.fullName) {
      return 'Empty Fullname'
    }

    if (user.fullName.trim().split(' ').length < 2) {
      return 'Fullname must include at least two words'
    }

    if (!/^[a-zA-Z ]+$/.test(user.fullName.trim())) {
      return 'Please enter a valid fullname'
    }

    if (user.fullName.trim().length > 30) {
      return 'Full name must not exceed 30 characters'
    }

    if (/\d/g.test(user.fullName)) {
      return 'Numbers are not allowed in the Fullname'
    }

    if (!user.age) {
      return 'Please enter your age'
    }

    if (
      Number(user.age) < 0 ||
      (user.age[0] === user.age[1] && user.age[1] === '0')
    ) {
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
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
        />

        <input
          autoComplete="off"
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
          type="number"
          className={styles.inputText}
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={(event) => setUser({ ...user, age: event.target.value })}
        />

        <textarea
          autoComplete="off"
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
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
