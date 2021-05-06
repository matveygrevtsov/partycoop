import React, { useContext, useEffect, useState } from 'react'
import styles from './EditMyInfoForm.module.css'
import { AuthContext } from '../../Auth'
import UploadImgForm from '../UploadImgForm/UploadImgForm'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import InternetConnectionProblem from '../InternetConnectionProblem/InternetConnectionProblem'
import { correctEditMyInfoForm } from '../../InputDataValidators/InputDataValidators'
import { EditMyInfoFormInterface } from '../../DataTypes'
import PagePreloader from '../PagePreloader/PagePreloader'

const EditMyInfoForm: React.FC = () => {
  const [pending, setPending] = useState(true)
  const { userData, updateCurrentUserData } = useContext(AuthContext)
  const [submitPending, setSubmitPending] = useState(true)
  const [submitMessage, setSubmitMessage] = useState('')
  const [connection, setConnection] = useState(true)
  const [
    newUserData,
    setNewUserData,
  ] = useState<EditMyInfoFormInterface | null>(null)

  const handleSubmit = () => {
    if (!newUserData) {
      return
    }
    const warning: string = correctEditMyInfoForm(userData, newUserData)
    if (warning !== '') {
      setSubmitMessage(warning)
      return
    }

    setSubmitPending(true)
    updateData('users', userData.id, newUserData).then(
      () => {
        updateCurrentUserData(newUserData)
        setSubmitMessage('Successfully saved!')
      },
      () => setConnection(false),
    )
  }

  useEffect(() => {
    if (newUserData && !submitPending) {
      const timeOutId = setTimeout(
        () => setSubmitMessage(correctEditMyInfoForm(userData, newUserData)),
        100,
      )
      return () => clearTimeout(timeOutId)
    }
  }, [userData, newUserData, submitPending])

  useEffect(() => {
    if (userData.id) {
      setNewUserData({
        fullName: userData.fullName,
        age: userData.age,
        aboutMe: userData.aboutMe,
        imageName: userData.imageName,
      })
      setPending(false)
    }
  }, [userData])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (!newUserData) {
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewUserData({
                ...newUserData,
                fullName: event.target.value.trim(),
              })
              setSubmitPending(false)
            }}
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewUserData({
                ...newUserData,
                age: Number(event.target.value),
              })
              setSubmitPending(false)
            }}
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
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setNewUserData({
                ...newUserData,
                aboutMe: event.target.value.trim(),
              })
              setSubmitPending(false)
            }}
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
          id={userData.id}
          startImageSrc={newUserData.imageName}
          setNewImage={(src: string) => {
            setNewUserData({
              ...newUserData,
              imageName: src,
            })
            setSubmitPending(false)
          }}
        />
      </div>
      <div className={styles.formCol}>
        <button
          disabled={pending || submitMessage !== '' || submitPending}
          className={styles.submitBtn}
          type="submit"
          onClick={handleSubmit}
        >
          Save changes
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
