import React, { useContext, useEffect, useState } from 'react'
import firebaseApp from '../../firebaseApp'
import styles from './EditMyInfoForm.module.css'
import { AuthContext } from '../../Auth'
import Preloader from '../Preloader/Preloader'
import imageNotFound from '../../images/imageNotFound.jpg'

// замечание: можно более компактно написать код
// при загрузке картинки желательно сделать превью

const storage = firebaseApp.storage()

const EditMyInfoForm: React.FC<any> = () => {
  const { currentUser } = useContext(AuthContext)
  const currentUserUid = currentUser.uid

  const [pending, setPending] = useState(true)
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [aboutMe, setAboutMe] = useState('')

  const [imgUrl, setImgUrl] = useState(imageNotFound)

  const [submitMessage, setSubmitMessage] = useState('')

  const [img, setImg]: any = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setPending(true)

    if (!/\S/.test(fullName)) {
      setSubmitMessage('Empty fullname!')
      return
    }

    if (!/\S/.test(aboutMe)) {
      setSubmitMessage('Empty text area!')
      return
    }

    try {
      let imgLink = ''
      if (img.name) {
        const storageRef = storage.ref()
        const fileRef = storageRef.child('images/' + img.name)
        await fileRef.put(img)
        imgLink = img.name
      }

      await firebaseApp
        .database()
        .ref('users/' + currentUser.uid)
        .update({
          fullName: fullName.trim(),
          age: age,
          aboutMe: aboutMe.trim(),
          imageName: imgLink,
        })

      setSubmitMessage('Successfully saved!')
    } catch (error) {
      setSubmitMessage(error)
    } finally {
      setPending(false)
    }
  }

  const onFileChange = (event: any) => {
    setImg(event.target.files[0])
  }

  useEffect(() => {
    function fetchUserData() {
      firebaseApp
        .database()
        .ref('users/' + currentUserUid)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val()
          setFullName(data['fullName'])
          setAge(data['age'])
          setAboutMe(data['aboutMe'])
  
          const ref = firebaseApp.storage().ref('images').child(data['imageName'])
          ref
            .getDownloadURL()
            .then((url) => {
              setImgUrl(url)
            })
            .catch(() => {
              setImgUrl(imageNotFound)
            })
        })
        .catch((err) => {})
        .finally(() => setPending(false))
    }
    fetchUserData()
  }, [currentUserUid])

  

  return pending ? (
    <Preloader />
  ) : (
    <form className={styles.addUserDataForm} onSubmit={handleSubmit}>
      <div className={styles.formCol}>
        <div className={styles.formGroup}>
          <span>
            Fullname<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
            required
            className={styles.inputText}
            type="text"
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Age<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) => setAge(event.target.value)}
            value={age}
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
            onChange={(event) => setAboutMe(event.target.value)}
            value={aboutMe}
            required
            className={styles.aboutMeArea}
          />
        </div>
      </div>
      <div className={styles.formCol}>
        <img className={styles.imgPreview} src={imgUrl} alt="Preview" />
        <input
          className={styles.uploadImgBtn}
          type="file"
          onChange={onFileChange}
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
