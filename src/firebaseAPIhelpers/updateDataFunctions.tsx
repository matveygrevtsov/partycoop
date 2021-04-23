import firebaseApp from '../firebaseApp'
import { rejectOnTimeout } from './fetchFunctions'

const maxExpectation = 5000

export function updateData(folder: string, id: string, values: any) {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref(folder + '/' + id)
      .update(values),
    maxExpectation,
  )
}
