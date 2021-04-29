import firebaseApp from '../firebaseApp'
import { rejectOnTimeout } from './fetchFunctions'

const maxExpectation: number = 5000

export function updateData(
  folder: string,
  id: string,
  values: object,
): Promise<void> {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref(folder + '/' + id)
      .update(values),
    maxExpectation,
  )
}
