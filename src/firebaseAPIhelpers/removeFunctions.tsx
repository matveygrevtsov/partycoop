import firebaseApp from '../firebaseApp'

const storage = firebaseApp.storage()

export function removeImgByUrl(url: string) {
  const ref = storage.refFromURL(url)
  return ref.delete
}
