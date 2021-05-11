import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import firebaseApp from '../../firebaseApp'
import styles from './SignUp.module.css'
import CenterLogo from '../../components/CenterLogo/CenterLogo'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import { Link } from 'react-router-dom'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import { SignUpInputInterface } from '../../DataTypes'
import { signUpFormValidator } from '../../InputDataValidators/SignUpFormValidator'

const SignUp: React.FC<any> = ({ history }) => {
  const [errorText, setErrorText] = useState<string>('')
  const [pending, setPending] = useState<boolean>(false)
  const [connection, setConnection] = useState<boolean>(true)
  const [user, setUser] = useState<SignUpInputInterface>({
    email: '',
    fullName: '',
    age: '',
    aboutMe: '',
    passwordLength: 0,
  })

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setErrorText(signUpFormValidator(user)),
      100,
    )
    return () => clearTimeout(timeOutId)
  }, [user])

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault()

      const { email, password, fullName, age, aboutMe } = event.target.elements

      const warning = signUpFormValidator({
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
        .then(
          () => history.push('/allparties'),
          (err) => {
            if (err.message === 'timeout_error') {
              setConnection(false)
            } else {
              setErrorText(err.message)
              setPending(false)
            }
          },
        )
    },
    [history],
  )

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (pending) {
    return <PagePreloader />
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
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setUser({ ...user, email: event.currentTarget.value })
          }
        />

        <input
          autoComplete="off"
          className={styles.inputText}
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, fullName: event.target.value })
          }
        />

        <input
          autoComplete="off"
          type="number"
          min="0"
          max="100"
          className={styles.inputText}
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, age: event.target.value })
          }
        />

        <textarea
          autoComplete="off"
          name="aboutMe"
          placeholder="Write a few words about yourself ..."
          className={styles.aboutMeArea}
          value={user.aboutMe}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
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
