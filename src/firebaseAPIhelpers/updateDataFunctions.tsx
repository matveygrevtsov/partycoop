import firebaseApp from '../firebaseApp'

export async function updateData(folder: string, id: string, values: any) {
  firebaseApp
    .database()
    .ref(folder + '/' + id)
    .update(values)
}
