import React, { useCallback, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState('')

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

        history.push('/')
      } catch (error) {
        setErrorText(String(error))
      }
    },
    [history],
  )

  const handleInputChange = () => setErrorText('')

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
