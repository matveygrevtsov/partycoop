import firebaseApp from '../firebaseApp'

export async function fetchData(collection: string, uid: string) {
  return firebaseApp
    .database()
    .ref(collection + '/' + uid)
    .once('value')
}
