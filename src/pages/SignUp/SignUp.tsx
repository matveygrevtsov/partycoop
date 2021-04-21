import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import Preloader from '../../components/Preloader/Preloader'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
    return () => {}
  }, [])

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()

      const { email, password, fullName, age, aboutMe } = event.target.elements

      if (!/\S/.test(fullName)) {
        setErrorText('Empty fullname!')
        return
      }

      if (!/\S/.test(aboutMe)) {
        setErrorText('Empty about you information!')
        return
      }

      if (password.length < 8) {
        setErrorText('Password length must be at least 8 characters')
        return
      }

      setPending(true)

      try {
        const userCredential = await firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
        const id = userCredential.user?.uid
        firebaseApp
          .database()
          .ref('users/' + id)
          .set({
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
    return <Preloader />
  }

  return (
    <section className={styles.signUpSection}>
      <CenterLogo />
      <form className={styles.signUpForm} onSubmit={handleSignUp}>
        <input
          required
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          onChange={() => setErrorText('')}
        />

        <input
          required
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={() => setErrorText('')}
        />

        <input
          required
          type="text"
          className={styles.inputText}
          name="fullName"
          placeholder="Fullname"
        />

        <input
          required
          type="number"
          className={styles.inputText}
          name="age"
          placeholder="Age"
          min="0"
        />

        <textarea
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
          required
          className={styles.aboutMeArea}
        />

        <p className={styles.errorText}>{errorText}</p>

        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>
      </form>
    </section>
  )
}

export default withRouter(SignUp)
