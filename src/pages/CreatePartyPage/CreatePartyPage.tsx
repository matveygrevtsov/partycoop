import React, { useContext, useEffect, useState } from 'react'
import styles from './CreatePartyPage.module.css'
import { AuthContext } from '../../Auth'
import { Link } from 'react-router-dom'
import { fetchUser } from '../../firebaseAPIhelpers/fetchFunctions'
import UploadImgForm from '../../components/UploadImgForm/UploadImgForm'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'

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
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid
  const [user, setUser]: any = useState(null)
  const [party, setParty]: any = useState({ author: currentUserId })
  const [submited, setSubmited] = useState(false)
  const [pending, setPending] = useState(false)
  const [submitErrorText, setSubmitErrorText] = useState('')
  const newPartyId = String(new Date().getTime())

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (isInvalidInputDate(party.meetingTime)) {
      setSubmitErrorText(
        'The party must be scheduled at least one day in advance!',
      )
      return
    }

    if (!/\S/.test(party.name)) {
      setSubmitErrorText('Empty name!')
      return
    }

    if (!/\S/.test(party.description)) {
      setSubmitErrorText('Empty description!')
      return
    }

    if (!/\S/.test(party.meetingPoint)) {
      setSubmitErrorText('Empty meeting point!')
      return
    }

    if (party.ageInterval[0] > party.ageInterval[1]) {
      setSubmitErrorText('Wrong age interval !')
      return
    }

    if (party.guestsNumberInterval[0] > party.guestsNumberInterval[1]) {
      setSubmitErrorText('Wrong guests number interval !')
      return
    }

    setPending(true)

    try {
      const id = await createDocument('parties', newPartyId, party)
      await updateData('users', currentUserId, {
        organizedParties: [id, ...user.organizedParties],
      })
      setSubmited(true)
    } catch {
      setSubmitErrorText('Internet connection error')
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    setPending(true)
    fetchUser(currentUserId)
      .then((user: any) => {
        setUser(user)
      })
      .finally(() => setPending(false))
  }, [currentUserId])

  if (pending) {
    return <PagePreloader />
  }

  if (submited) {
    return (
      <section className={styles.createParty}>
        <h2>Party successfully created!</h2>
        <span>
          You will find it in the <Link to="/parties/">My parties</Link> tab
        </span>
      </section>
    )
  }

  return (
    <section className={styles.createParty}>
      <form className={styles.addUserDataForm} onSubmit={handleSubmit}>
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
                  Number(event.target.value),
                  party.ageInterval ? party.ageInterval[1] : 100,
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="0"
            max="100"
          />

          <input
            onChange={(event) =>
              setParty({
                ...party,
                ageInterval: [
                  party.ageInterval ? party.ageInterval[0] : 0,
                  Number(event.target.value),
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="0"
            max="100"
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
                  Number(event.target.value),
                  party.guestsNumberInterval
                    ? party.guestsNumberInterval[1]
                    : 100,
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="1"
            max="100"
          />

          <input
            onChange={(event) =>
              setParty({
                ...party,
                guestsNumberInterval: [
                  party.guestsNumberInterval
                    ? party.guestsNumberInterval[0]
                    : 1,
                  Number(event.target.value),
                ],
              })
            }
            type="number"
            required
            className={styles.inputText}
            min="1"
            max="100"
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

        <p className={styles.redText}>{submitErrorText}</p>

        <div className={styles.formGroup}>
          <button className={styles.submitBtn} type="submit">
            Save
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePartyPage
