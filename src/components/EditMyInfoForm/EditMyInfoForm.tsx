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

  const handleSubmit = (event: any) => {
    event.preventDefault()

    if (!/\S/.test(user.fullName)) {
      setSubmitMessage('Empty fullname!')
      return
    }

    if (!/\S/.test(user.aboutMe)) {
      setSubmitMessage('Empty text area!')
      return
    }

    setPending(true)
    updateData('users', currentUserId, user)
      .then(() => setSubmitMessage('Successfully saved!'))
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: any) => {
        setUser(user)
      })
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return <Preloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <form className={styles.addUserDataForm} onSubmit={handleSubmit}>
      <div className={styles.formCol}>
        <div className={styles.formGroup}>
          <span>
            Fullname<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) =>
              setUser({ ...user, fullName: event.target.value })
            }
            value={user.fullName}
            required
            className={styles.inputText}
            type="text"
            pattern="[a-zA-Z]*"
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Age<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) => setUser({ ...user, age: event.target.value })}
            value={user.age}
            type="number"
            required
            className={styles.inputText}
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            About me<span className={styles.redText}>*</span>:
          </span>
          <textarea
            onChange={(event) =>
              setUser({ ...user, aboutMe: event.target.value })
            }
            value={user.aboutMe}
            required
            className={styles.aboutMeArea}
          />
        </div>
      </div>
      <div className={styles.formCol}>
        <UploadImgForm
          folder="users"
          id={currentUserId}
          startImageSrc={user.imageName}
          setNewImage={(src: string) => setUser({ ...user, imageName: src })}
        />
      </div>
      <div className={styles.formCol}>
        <button className={styles.submitBtn} type="submit">
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
