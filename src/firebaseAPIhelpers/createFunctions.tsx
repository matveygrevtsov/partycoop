import firebaseApp from '../firebaseApp'

export async function createDocument(folder: string, id: string, data: any) {
  try {
    await firebaseApp
      .database()
      .ref(folder + '/' + id)
      .set(data)
    return id
  } catch (error) {
    throw new Error(error)
  }
}
