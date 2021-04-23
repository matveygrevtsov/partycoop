import firebaseApp from '../firebaseApp'

const maxExpectation = 5000

export const rejectOnTimeout = async (promise: any, ms: number) =>
  new Promise((resolve, reject) => {
    promise.then(
      (res: any) => resolve(res),
      (err: any) => reject(err),
    )
    setTimeout(() => {
      reject('timeout_error')
    }, ms)
  })

export async function fetchParty(id: string) {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref('parties/' + id)
      .once('value')
      .then((snapshot: any) => {
        const data = snapshot.val()
        return {
          id: id,
          ageInterval: data.ageInterval || [],
          author: data.author,
          description: data.description,
          guestsNumberInterval: data.guestsNumberInterval || [],
          imageName: data.imageName,
          meetingPoint: data.meetingPoint,
          meetingTime: data.meetingTime,
          name: data.name,
          guests: data.guests || [],
          waitingRequests: data.waitingRequests || [],
          rejectedRequests: data.rejectedRequests || [],
        }
      }),
    maxExpectation,
  )
}

export async function fetchUser(id: string) {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref('users/' + id)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        return {
          aboutMe: data.aboutMe,
          age: data.age,
          fullName: data.fullName,
          id: data.id,
          imageName: data.imageName,
          organizedParties: data.organizedParties || [],
          waitingRequests: data.waitingRequests || [],
          rejectedRequests: data.rejectedRequests || [],
          participation: data.participation || [],
        }
      }),
    maxExpectation,
  )
}

export async function fetchUsers(ids: string[]) {
  return rejectOnTimeout(
    Promise.all(ids.map((id: string) => fetchUser(id))).then((users: any) => {
      let res: any = {}
      users.forEach((user: any) => (res[user.id] = user))
      return res
    }),
    maxExpectation,
  )
}

export async function fetchAllPartiesIdsBesides(unwantedIds: string[]) {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref('parties')
      .once('value')
      .then((snapshot: any) => {
        const data = snapshot.val()
        return Object.keys(data).filter((key) => !unwantedIds.includes(key))
      }),
    maxExpectation,
  )
}
