import React, { useContext, useEffect, useState } from 'react'
import styles from './CreatePartyPage.module.css'
import { AuthContext } from '../../Auth'
import UploadImgForm from '../../components/UploadImgForm/UploadImgForm'
import { createDocument } from '../../firebaseAPIhelpers/createFunctions'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import PagePreloader from '../../components/PagePreloader/PagePreloader'
import InternetConnectionProblem from '../../components/InternetConnectionProblem/InternetConnectionProblem'
import { CreatePartyFormInterface } from '../../DataTypes'
import { createPartyFormValidator } from '../../InputDataValidators/CreatePartyFormValidator'
import PartySuccessfullyCreated from '../../components/PartySuccessfullyCreated/PartySuccessfullyCreated'

const CreatePartyPage: React.FC = () => {
  const [connection, setConnection] = useState(true)
  const { userData, updateCurrentUserData } = useContext(AuthContext)
  const [party, setParty] = useState<CreatePartyFormInterface>({
    author: userData.id,
    imageName: '',
    ageInterval: ['', ''],
    guestsNumberInterval: ['', ''],
    name: '',
    meetingPoint: '',
    description: '',
    meetingTime: '',
  })
  const [submited, setSubmited] = useState(false)
  const [pending, setPending] = useState(true)
  const [errorText, setErrorText] = useState('')
  const newPartyId = String(new Date().getTime())

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const warning = createPartyFormValidator(party)
    if (warning !== '') {
      setErrorText(warning)
      return
    }
    setPending(true)
    createDocument('parties', newPartyId, party)
      .then(() =>
        updateData('users', userData.id, {
          organizedParties: [newPartyId, ...userData.organizedParties],
        }),
      )
      .then(() => {
        updateCurrentUserData({
          organizedParties: [newPartyId, ...userData.organizedParties],
        })
        setSubmited(true)
      })
      .catch(() => setConnection(false))
      .finally(() => setPending(false))
  }

  useEffect(() => {
    if (userData.id) {
      setPending(false)
    }
  }, [userData])

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setErrorText(createPartyFormValidator(party)),
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

  if (submited) {
    return <PartySuccessfullyCreated />
  }

  return (
    <section className={styles.createParty}>
      <form className={styles.addUserDataForm}>
        <div className={styles.formGroup}>
          <span>
            Name<span className={styles.redText}>*</span>:
            <input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
