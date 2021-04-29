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
import { User } from '../../DataTypes'

type PartyTemplate = {
  author: string
  imageName: string
  ageInterval: [string, string]
  guestsNumberInterval: [string, string]
  name: string
  meetingPoint: string
  description: string
  meetingTime: string
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

const CreatePartyPage: React.FC = () => {
  const [connection, setConnection] = useState(true)
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [user, setUser] = useState<User | null>(null)
  const [party, setParty] = useState<PartyTemplate>({
    author: currentUserId,
    imageName: '',
    ageInterval: ['', ''],
    guestsNumberInterval: ['', ''],
    name: '',
    meetingPoint: '',
    description: '',
    meetingTime: '',
  })
  const [submited, setSubmited] = useState(false)
  const [pending, setPending] = useState(false)
  const [errorText, setErrorText] = useState('')
  const newPartyId = String(new Date().getTime())

  const inputDataWarning = (party: PartyTemplate) => {
    if (
      !party.name &&
      !party.ageInterval[0] &&
      !party.ageInterval[1] &&
      !party.guestsNumberInterval[0] &&
      !party.guestsNumberInterval[1] &&
      !party.name &&
      !party.meetingPoint &&
      !party.description &&
      !party.meetingTime
    ) {
      return ' '
    }

    const trimPartyName = party.name.trim()

    if (!trimPartyName) {
      return 'Empty name'
    }

    if (trimPartyName.length > 30) {
      return 'Party name must not exceed 30 characters'
    }

    if (!party.ageInterval[0] || !party.ageInterval[1]) {
      return 'Empty age interval'
    }

    if (
      party.ageInterval[0][0] === party.ageInterval[0][1] &&
      party.ageInterval[0][1] === '0'
    ) {
      return 'Wrong age interval'
    }

    if (
      party.ageInterval[1][0] === party.ageInterval[1][1] &&
      party.ageInterval[1][1] === '0'
    ) {
      return 'Wrong age interval'
    }

    const age1 = Number(party.ageInterval[0])
    const age2 = Number(party.ageInterval[1])

    if (age1 < 0 || age1 > age2) {
      return 'Wrong age interval!'
    }

    if (!party.guestsNumberInterval[0] || !party.guestsNumberInterval[1]) {
      return 'Empty guests number interval!'
    }

    const guestNumber1 = Number(party.guestsNumberInterval[0])
    const guestNumber2 = Number(party.guestsNumberInterval[1])

    if (guestNumber1 < 0 || guestNumber1 > guestNumber2) {
      return 'Wrong guests number interval!'
    }

    if (guestNumber1 < 1) {
      return 'There must be at least one guest at the party!'
    }

    if (guestNumber2 > 100) {
      return 'The number of guests must not exceed 100'
    }

    if (!party.meetingPoint.trim()) {
      return 'Empty meeting point!'
    }

    if (!party.meetingTime) {
      return 'Please schedule a meeting time.'
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

    if (!user) {
      return
    }

    const warning = inputDataWarning(party)
    if (warning !== '') {
      setErrorText(warning)
      return
    }

    setPending(true)

    createDocument('parties', newPartyId, party)
      .then((id: string) => {
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
      .then((user: User) => {
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
  }, [party])

  if (pending) {
    return <PagePreloader />
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  if (!user) {
    return null
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
            className={styles.inputText}
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
            className={styles.inputText}
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
                  party.guestsNumberInterval[1],
                ],
              })
            }
            type="number"
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
                  event.target.value,
                ],
              })
            }
            type="number"
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
            className={styles.descriptionArea}
            value={party.description}
          />
        </div>

        <div className={styles.formGroup}>
          <span>
            Meeting time<span className={styles.redText}>*</span>:
          </span>
          <input
            onChange={(event) =>
              setParty({ ...party, meetingTime: event.target.value })
            }
            type="date"
            name="trip-start"
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
