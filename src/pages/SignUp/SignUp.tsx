import React, { useCallback, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')
  const [pending, setPending] = useState(false)

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()

      const { email, password, fullName, age, aboutMe } = event.target.elements
      if (!/\S/.test(fullName.value)) {
        setErrorText('Empty fullname!')
        return
      }

      if (!/\S/.test(aboutMe.value)) {
        setErrorText('Empty about you information!')
        return
      }

      if (password.value.length < 8) {
        setErrorText('Password length must be at least 8 characters')
        return
      }

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
          required
          className={styles.inputText}
          name="email"
          type="email"
          placeholder="Email"
          onChange={() => {
            setErrorText('')
          }}
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
          onChange={() => setErrorText('')}
          pattern="[a-zA-Z]*"
        />

        <input
          required
          type="number"
          className={styles.inputText}
          name="age"
          placeholder="Age"
          min="0"
          onChange={() => setErrorText('')}
        />

        <textarea
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
          required
          className={styles.aboutMeArea}
          onChange={() => setErrorText('')}
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
