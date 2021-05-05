import { Party, User } from '../DataTypes'
import firebaseApp from '../firebaseApp'
import { rejectOnTimeout } from './fetchFunctions'

const maxExpectation: number = 5000

export const updateData = (
  folder: string,
  id: string,
  values: object,
): Promise<void> => {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref(folder + '/' + id)
      .update(values),
    maxExpectation,
  )
}

export const acceptWaitingRequest = (party: Party, user: User) => {
  return rejectOnTimeout(
    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: party.waitingRequests.filter(
          (id: string) => id !== user.id,
        ),
        guests: [user.id, ...party.guests],
      }),
      updateData('users', user.id, {
        participation: [party.id, ...user.participation],
        waitingRequests: user.waitingRequests.filter(
          (id: string) => id !== party.id,
        ),
      }),
    ]),
    maxExpectation,
  )
}

export const rejectWaitingRequest = (party: Party, user: User) => {
  return rejectOnTimeout(
    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: party.waitingRequests.filter(
          (id: string) => id !== user.id,
        ),
        rejectedRequests: [user.id, ...party.rejectedRequests],
      }),
      updateData('users', user.id, {
        rejectedRequests: [party.id, ...user.rejectedRequests],
        waitingRequests: user.waitingRequests.filter(
          (id: string) => id !== party.id,
        ),
      }),
    ]),
    maxExpectation,
  )
}

export const addWaitingRequest = (party: Party, user: User) => {
  return rejectOnTimeout(
    Promise.all([
      updateData('parties', party.id, {
        waitingRequests: [user.id, ...party.waitingRequests],
      }),
      updateData('users', user.id, {
        waitingRequests: [party.id, ...user.waitingRequests],
      }),
    ]),
    maxExpectation,
  )
}
