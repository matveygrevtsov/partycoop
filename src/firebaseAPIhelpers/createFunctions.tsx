import firebaseApp from '../firebaseApp'
import { rejectOnTimeout } from './fetchFunctions'

const maxExpectation: number = 5000

export const createDocument = (
  folder: string,
  id: string,
  data: object,
): Promise<string> => {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref(folder + '/' + id)
      .set(data)
      .then(() => id),
    maxExpectation,
  )
}
