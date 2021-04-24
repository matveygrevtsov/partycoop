import React, { useContext, useEffect, useState } from 'react'
import styles from './CreatePartyPage.module.css'
import { AuthContext } from '../../Auth'
import { Link } from 'react-router-dom'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import UploadImgForm from '../../components/UploadImgForm/UploadImgForm'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'

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
  const [connection, setConnection] = useState(true)
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [user, setUser]: any = useState(null)
  const [party, setParty]: any = useState({
    author: currentUserId,
    imageName: '',
    ageInterval: ['', ''],
    guestsNumberInterval: ['', ''],
    description: '',
    name: '',
    meetingPoint: '',
    meetingTime: '',
  })
  const [submited, setSubmited] = useState(false)
  const [pending, setPending] = useState(false)
  const [errorText, setErrorText] = useState('')
  const newPartyId = String(new Date().getTime())

  const inputDataWarning = (party: any) => {
    if (!party.name.trim()) {
      return ' '
    }
    const age1 = Number(party.ageInterval[0])
    const age2 = Number(party.ageInterval[1])

    if (age1 < 0 || age1 > age2) {
      return 'Wrong age interval!'
    }

    const guestNumber1 = Number(party.guestsNumberInterval[0])
    const guestNumber2 = Number(party.guestsNumberInterval[1])

    if (guestNumber1 < 0 || guestNumber1 > guestNumber2) {
      return 'Wrong guests number interval!'
    }

    if (guestNumber1 < 1) {
      return 'There must be at least one guest at the party!'
    }

    if (!party.meetingPoint.trim()) {
      return 'Empty meeting point!'
    }

    if (isInvalidInputDate(party.meetingTime)) {
      return 'The party must be scheduled at least one day in advance!'
    }

    if (!party.description.trim()) {
      return 'Empty description!'
    }
    return ''
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const warning = inputDataWarning(party)
    if (warning !== '') {
      setErrorText(warning)
      return
    }

    setPending(true)

    createDocument('parties', newPartyId, party)
      .then((id: any) => {
        return updateData('users', currentUserId, {
          organizedParties: [id, ...user.organizedParties],
        })
      })
      .then(() => setSubmited(true))
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

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setErrorText(inputDataWarning(party)),
      100,
    )
    return () => clearTimeout(timeOutId)
  }, [user, party])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (submited) {
    return (
      <section className={styles.createParty}>
        <h2>Party successfully created!</h2>
        <span>
          You will find it in the{' '}
          <Link to={'/organized_and_participation/' + currentUserId + '/'}>
            My parties
          </Link>{' '}
          tab
        </span>
      </section>
    )
  }

  return (
    <section className={styles.createParty}>
      <form className={styles.addUserDataForm}>
        <div className={styles.formGroup}>
          <span>
            Name<span className={styles.redText}>*</span>:
            <input
              onChange={(event) =>
                setParty({ ...party, name: event.target.value })
              }
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
            onChange={(event) =>
              setParty({
                ...party,
                ageInterval: [
                  event.target.value,
                  party.ageInterval ? party.ageInterval[1] : '100',
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="0"
            max="100"
            value={party.ageInterval[0]}
          />

          <input
            onChange={(event) =>
              setParty({
                ...party,
                ageInterval: [party.ageInterval[0], event.target.value],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="0"
            max="100"
            value={party.ageInterval[1]}
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Guests number interval<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) =>
              setParty({
                ...party,
                guestsNumberInterval: [
                  event.target.value,
                  party.guestsNumberInterval,
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="1"
            max="100"
            value={party.guestsNumberInterval[0]}
          />

          <input
            onChange={(event) =>
              setParty({
                ...party,
                guestsNumberInterval: [
                  party.guestsNumberInterval[0],
                  Number(event.target.value),
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="1"
            max="100"
            value={party.guestsNumberInterval[1]}
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Meeting point<span className={styles.redText}>*</span>:
            <input
              onChange={(event) =>
                setParty({ ...party, meetingPoint: event.target.value })
              }
              required
              className={styles.inputText}
              type="text"
              value={party.meetingPoint}
            />
          </span>
        </div>

        <div className={styles.formGroup}>
          <span>
            Description<span className={styles.redText}>*</span>:
          </span>
          <textarea
            onChange={(event) =>
              setParty({ ...party, description: event.target.value })
            }
            required
            className={styles.descriptionArea}
            value={party.description}
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Meeting time<span className={styles.redText}>*</span>:
          </span>
          <input
            required
            onChange={(event) =>
              setParty({ ...party, meetingTime: event.target.value })
            }
            type="date"
            name="trip-start"
            min={getDateNow()}
            max="2025-12-31"
            className={styles.chooseDate}
            value={party.meetingTime}
          ></input>
        </div>

        <div className={styles.formGroup}>
          <UploadImgForm
            folder="parties"
            id={newPartyId}
            setNewImage={(src: string) =>
              setParty({ ...party, imageName: src })
            }
          />
        </div>

        <p className={styles.redText}>{errorText}</p>

        <div className={styles.formGroup}>
          <button
            disabled={errorText !== ''}
            onClick={handleSubmit}
            className={styles.submitBtn}
          >
            Save
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePartyPage
