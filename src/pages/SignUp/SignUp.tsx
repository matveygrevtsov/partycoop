import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import { Link } from 'react-router-dom'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')
  const [pending, setPending] = useState(false)
  const [inputIsCorrect, setInputIsCorrect] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [passwordLength, setPasswordLength] = useState(0)

  const checkInputData = (
    email: string,
    fullName: string,
    age: string,
    aboutMe: string,
    passwordLength: number,
  ) => {
    setInputIsCorrect(false)
    setErrorText('')

    if (!email) {
      return
    }

    if (!email.includes('@')) {
      setErrorText('Please enter a valid email')
      return
    }

    if (passwordLength < 6) {
      setErrorText('Your password must contain at least 6 characters')
      return
    }

    if (!fullName) {
      return
    }

    if (/\d/g.test(fullName)) {
      setErrorText('Numbers are not allowed in the Fullname')
      return
    }

    if (Number(age) < 0) {
      setErrorText('Wrong age')
      return
    }

    if (!aboutMe) {
      setErrorText('Empty about you information')
      return
    }
    setInputIsCorrect(true)
    setErrorText('')
  }

  useEffect(() => {
    const timeOutId = setTimeout(
      () => checkInputData(email, fullName, age, aboutMe, passwordLength),
      100,
    )
    return () => clearTimeout(timeOutId)
  }, [email, fullName, age, aboutMe, passwordLength])

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()

      const { email, password, fullName, age, aboutMe } = event.target.elements

      setPending(true)

      try {
        const userCredential = await firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
        const id: any = userCredential.user?.uid
        createDocument('users', id, {
          id: id,
          fullName: fullName.value.trim(),
          age: age.value,
          aboutMe: aboutMe.value.trim(),
        })
        history.push('/settings')
      } catch (error) {
        setErrorText(String(error))
      } finally {
        setPending(false)
      }
    },
    [history],
  )

  if (pending) {
    return <PagePreloader />
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
          value={email}
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

        <input
          autoComplete="off"
          required
          type="text"
          className={styles.inputText}
          name="fullName"
          placeholder="Fullname"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
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
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <textarea
          autoComplete="off"
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
          required
          className={styles.aboutMeArea}
          value={aboutMe}
          onChange={(event) => setAboutMe(event.target.value)}
        />

        <p className={styles.errorText}>{errorText}</p>

        <button
          disabled={!inputIsCorrect}
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
