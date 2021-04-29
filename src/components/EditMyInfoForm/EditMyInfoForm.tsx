import React, { useContext, useEffect, useState } from 'react'
import styles from './EditMyInfoForm.module.css'
import { AuthContext } from '../../Auth'
import UploadImgForm from '../UploadImgForm/UploadImgForm'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import Preloader from '../Preloader/Preloader'
import InternetConnectionProblem from '../InternetConnectionProblem/InternetConnectionProblem'
import { User } from '../../DataTypes'

type InputUserData = {
  fullName: string
  age: number
  aboutMe: string
  imageName: string
}

const EditMyInfoForm: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [pending, setPending] = useState(true)
  const [submitPending, setSubmitPending] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [submitMessage, setSubmitMessage] = useState('')
  const [connection, setConnection] = useState(true)
  const [newUserData, setNewUserData] = useState<InputUserData | null>(null)

  const inputDataWarning = (
    userData: InputUserData,
    currentUser: User,
  ) => {
    const trimInputFullName = userData.fullName.trim()
    const trimInputAboutMe = userData.aboutMe.trim()

    if (!trimInputFullName) {
      return 'Empty Fullname'
    }
    if (/\d/g.test(trimInputFullName)) {
      return 'Numbers are not allowed in the Fullname'
    }
    if (userData.age < 0) {
      return 'Wrong age'
    }
    if (!trimInputAboutMe) {
      return 'Empty about me info'
    }
    if (
      currentUser.fullName === trimInputFullName &&
      currentUser.age === userData.age &&
      currentUser.aboutMe === trimInputAboutMe &&
      currentUser.imageName === userData.imageName
    ) {
      return ' '
    }

    return ''
  }

  const handleSubmit = () => {
    if(!newUserData || !user) {
      return
    }
    const warning: string = inputDataWarning(newUserData, user)
    if (warning !== '') {
      setSubmitMessage(warning)
      return
    }

    setSubmitPending(true)
    updateData('users', currentUserId, newUserData)
      .then(() => setSubmitMessage('Successfully saved!'))
      .catch(() => setConnection(false))
      .finally(() => setSubmitPending(false))
  }

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: User) => {
        setUser(user)
        setNewUserData({
          fullName: user.fullName,
          age: user.age,
          aboutMe: user.aboutMe,
          imageName: user.imageName,
        })
      })
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }, [currentUserId])

  useEffect(() => {
    if (user && newUserData) {
      const timeOutId = setTimeout(
        () => setSubmitMessage(inputDataWarning(newUserData, user)),
        100,
      )
      return () => clearTimeout(timeOutId)
    }
  }, [user, newUserData])

  if (pending) {
    return <Preloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (!newUserData || !user) {
    return null
  }

  return (
    <form className={styles.addUserDataForm}>
      <div className={styles.formCol}>
        <div className={styles.formGroup}>
          <span>
            Fullname<span className={styles.redText}>*</span>:
          </span>
          <input
            autoComplete="off"
            onChange={(event) =>
              setNewUserData({
                fullName: event.target.value,
                age: newUserData?.age,
                aboutMe: newUserData?.aboutMe,
                imageName: newUserData?.imageName,
              })
            }
            value={newUserData.fullName}
            required
            className={styles.inputText}
            type="text"
            name="fullName"
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Age<span className={styles.redText}>*</span>:
          </span>
          <input
            autoComplete="off"
            onChange={(event) =>
              setNewUserData({
                fullName: newUserData.fullName,
                age: Number(event.target.value),
                aboutMe: newUserData?.aboutMe,
                imageName: newUserData?.imageName,
              })
            }
            value={String(newUserData.age)}
            type="number"
            required
            className={styles.inputText}
            name="age"
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            About me<span className={styles.redText}>*</span>:
          </span>
          <textarea
            autoComplete="off"
            onChange={(event) =>
              setNewUserData({
                fullName: newUserData.fullName,
                age: newUserData.age,
                aboutMe: event.target.value,
                imageName: newUserData?.imageName,
              })
            }
            value={newUserData.aboutMe}
            required
            className={styles.aboutMeArea}
            name="aboutMe"
          />
        </div>
      </div>
      <div className={styles.formCol}>
        <UploadImgForm
          folder="users"
          id={currentUserId}
          startImageSrc={newUserData.imageName}
          setNewImage={(src: string) =>
            setNewUserData({
              fullName: newUserData.fullName,
              age: newUserData.age,
              aboutMe: newUserData.aboutMe,
              imageName: src,
            })
          }
        />
      </div>
      <div className={styles.formCol}>
        <button
          disabled={submitMessage !== '' || submitPending}
          className={styles.submitBtn}
          type="submit"
          onClick={handleSubmit}
        >
          {submitPending ? 'Loading ...' : 'Save changes'}
        </button>
        <p
          className={
            submitMessage === 'Successfully saved!'
              ? styles.greenText
              : styles.redText
          }
        >
          {submitMessage}
        </p>
      </div>
    </form>
  )
}

export default EditMyInfoForm
