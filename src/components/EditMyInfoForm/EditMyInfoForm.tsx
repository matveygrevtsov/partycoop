import React, { useContext, useEffect, useState } from 'react'
import styles from './EditMyInfoForm.module.css'
import { AuthContext } from '../../Auth'
import UploadImgForm from '../UploadImgForm/UploadImgForm'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import Preloader from '../Preloader/Preloader'
import InternetConnectionProblem from '../InternetConnectionProblem/InternetConnectionProblem'

const EditMyInfoForm: React.FC<any> = () => {
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [pending, setPending] = useState(true)
  const [user, setUser]: any = useState(null)
  const [submitMessage, setSubmitMessage] = useState('')
  const [connection, setConnection] = useState(true)
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [imageName, setImageName] = useState('')
  const [submitPending, setSubmitPending] = useState(false)

  const inputDataWarning = (
    fullName: string,
    age: string,
    aboutMe: string,
    imageName: string,
    oldInfo: any,
  ) => {
    if (!fullName.trim()) {
      return 'Empty Fullname'
    }
    if (!age) {
      return 'Empty age'
    }
    if (age[0] === age[1] && age[1] === '0') {
      return 'Wrong age'
    }
    if (!aboutMe.trim()) {
      return 'Empty about me info'
    }
    if (
      oldInfo.fullName === fullName.trim() &&
      oldInfo.age === Number(age) &&
      oldInfo.aboutMe === aboutMe.trim() &&
      oldInfo.imageName === imageName
    ) {
      return ' '
    }
    if (/\d/g.test(fullName)) {
      return 'Numbers are not allowed in the Fullname'
    }
    if (Number(age) < 0) {
      return 'Wrong age'
    }
    return ''
  }

  const handleSubmit = () => {
    const warning = inputDataWarning(fullName, age, aboutMe, imageName, user)
    if (warning !== '') {
      setSubmitMessage(warning)
      return
    }

    setSubmitPending(true)
    updateData('users', currentUserId, {
      fullName: fullName.trim(),
      aboutMe: aboutMe.trim(),
      age: Number(age),
      imageName: imageName,
    })
      .then(() => setSubmitMessage('Successfully saved!'))
      .catch(() => setConnection(false))
      .finally(() => setSubmitPending(false))
  }

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: any) => {
        setUser(user)
        setFullName(user.fullName)
        setAge(String(user.age))
        setAboutMe(user.aboutMe)
        setImageName(user.imageName)
      })
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }, [currentUserId])

  useEffect(() => {
    if (user) {
      const timeOutId = setTimeout(
        () =>
          setSubmitMessage(
            inputDataWarning(fullName, age, aboutMe, imageName, user),
          ),
        100,
      )
      return () => clearTimeout(timeOutId)
    }
  }, [user, fullName, age, aboutMe, imageName])

  if (pending) {
    return <Preloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
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
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
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
            onChange={(event) => setAge(event.target.value)}
            value={age}
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
            onChange={(event) => setAboutMe(event.target.value)}
            value={aboutMe}
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
          startImageSrc={imageName}
          setNewImage={(src: string) => setImageName(src)}
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
