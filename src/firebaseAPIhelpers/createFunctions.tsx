import firebaseApp from '../firebaseApp'
import { rejectOnTimeout } from './fetchFunctions'

const maxExpectation: number = 5000

export function createDocument(folder: string, id: string, data: object) {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref(folder + '/' + id)
      .set(data)
      .then(() => id),
    maxExpectation,
  )
}
