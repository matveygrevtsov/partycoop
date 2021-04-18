import React, { useContext, useEffect, useState } from 'react'
import styles from './CreatePartyPage.module.css'
import firebaseApp from '../../firebaseApp'

import NavBar from '../../components/NavBar/NavBar'
import { AuthContext } from '../../Auth'
import { Link } from 'react-router-dom'
import Preloader from '../../components/Preloader/Preloader'

const storage = firebaseApp.storage()

function getDateNow() {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function isInvalidInputDate(inputDate: string) {
  let values = inputDate.split('-').map((value: string) => Number(value))
  const date1 = new Date(values[0], values[1] - 1, values[2], 11, 59, 59, 999)
  const date2 = new Date()
  if (date1.getTime() < date2.getTime()) {
    return true
  }
  return false
}

const CreatePartyPage: React.FC<any> = () => {
  // current user data
  const { currentUser } = useContext(AuthContext)
  const [organizedParties, setOrganizedParties] = useState([])
  const currentUserUid = currentUser.uid

  const [name, setName] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [description, setDescription] = useState('')
  const [pending, setPending] = useState(false)
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(100)
  const [meetingTime, setMeetingTime] = useState(getDateNow())
  const [submited, setSubmited] = useState(false)
  const [meetingPoint, setMeetingPoint] = useState('')

  const [minGuestsNumber, setMinGuestsNumber] = useState(1)
  const [maxGuestsNumber, setMaxGuestsNumber] = useState(100)

  const [img, setImg]: any = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setPending(true)

    if (isInvalidInputDate(meetingTime)) {
      setSubmitMessage(
        'The party must be scheduled at least one day in advance!',
      )
      setPending(false)
      return
    }

    if (!/\S/.test(name)) {
      setSubmitMessage('Empty name!')
      setPending(false)
      return
    }

    if (!/\S/.test(description)) {
      setSubmitMessage('Empty description!')
      setPending(false)
      return
    }

    if (!/\S/.test(meetingPoint)) {
      setSubmitMessage('Empty meeting point!')
      setPending(false)
      return
    }

    try {
      let imgSrc = ''
      if (img.name) {
        const storageRef = storage.ref()
        const fileRef = storageRef.child('images/' + img.name)
        await fileRef.put(img)
        imgSrc = img.name
      }

      const id = String(Date.now())

      firebaseApp
        .database()
        .ref('parties/' + id)
        .set({
          ageInterval: [minAge, maxAge],
          author: currentUserUid,
          description: description,
          guestsNumberInterval: [minGuestsNumber, maxGuestsNumber],
          id: id,
          imageName: imgSrc,
          meetingTime: meetingTime,
          meetingPoint: meetingPoint,
          name: name,
        })

      firebaseApp
        .database()
        .ref('users/' + currentUserUid)
        .update({
          organizedParties: [id, ...organizedParties],
        })

      setSubmitMessage('Successfully saved!')
      setSubmited(true)
    } catch (error) {
      setSubmitMessage(error)
    } finally {
      setPending(false)
    }
  }

  function fetchUserData() {
    setPending(true)
    firebaseApp
      .database()
      .ref('users/' + currentUserUid)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        const organizedPartiesArray = data['organizedParties']
        if (organizedPartiesArray) {
          setOrganizedParties(organizedPartiesArray)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setPending(false))
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const onFileChange = (event: any) => {
    setImg(event.target.files[0])
  }

  if (pending) {
    return <Preloader />
  }

  if (submited) {
    return (
      <>
        <NavBar />
        <section className={styles.createParty}>
          <h2>Party successfully created!</h2>
          <span>
            You will find it in the <Link to="/parties/">My parties</Link> tab
          </span>
        </section>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <section className={styles.createParty}>
        <form className={styles.addUserDataForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <span>
              Name<span className={styles.redText}>*</span>:
              <input
                onChange={(event) => setName(event.target.value)}
                value={name}
                required
                className={styles.inputText}
                type="text"
              />
            </span>
          </div>

          <div className={styles.formGroup}>
            <span>
              Age interval<span className={styles.redText}>*</span>:
            </span>
            <input
              onChange={(event) => setMinAge(Number(event.target.value))}
              value={minAge}
              type="number"
              required
              className={styles.inputText}
              min="0"
              max={maxAge}
            />

            <input
              onChange={(event) => setMaxAge(Number(event.target.value))}
              value={maxAge}
              type="number"
              required
              className={styles.inputText}
              min={minAge}
            />
          </div>

          <div className={styles.formGroup}>
            <span>
              Guests number interval<span className={styles.redText}>*</span>:
            </span>
            <input
              onChange={(event) =>
                setMinGuestsNumber(Number(event.target.value))
              }
              value={minGuestsNumber}
              type="number"
              required
              className={styles.inputText}
              min="1"
              max={maxGuestsNumber}
            />

            <input
              onChange={(event) =>
                setMaxGuestsNumber(Number(event.target.value))
              }
              value={maxGuestsNumber}
              type="number"
              required
              className={styles.inputText}
              min={minGuestsNumber}
            />
          </div>

          <div className={styles.formGroup}>
            <span>
              Meeting point<span className={styles.redText}>*</span>:
              <input
                onChange={(event) => setMeetingPoint(event.target.value)}
                value={meetingPoint}
                required
                className={styles.inputText}
                type="text"
              />
            </span>
          </div>

          <div className={styles.formGroup}>
            <span>
              Description<span className={styles.redText}>*</span>:
            </span>
            <textarea
              onChange={(event) => setDescription(event.target.value)}
              value={description}
              required
              className={styles.descriptionArea}
            />
          </div>

          <div className={styles.formGroup}>
            <span>
              Meeting date<span className={styles.redText}>*</span>:
            </span>
            <input
              required
              onChange={(event) => setMeetingTime(event.target.value)}
              type="date"
              name="trip-start"
              value={meetingTime}
              min={getDateNow()}
              max="2025-12-31"
              className={styles.chooseDate}
            ></input>
          </div>

          <div className={styles.formGroup}>
            <input
              className={styles.uploadImgBtn}
              type="file"
              onChange={onFileChange}
            />
          </div>

          <div className={styles.formGroup}>
            <button className={styles.submitBtn} type="submit">
              Save
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
      </section>
    </>
  )
}

export default CreatePartyPage
