import firebaseApp from '../firebaseApp'
import { User, Party, UsersObject } from '../DataTypes'

const maxExpectation: number = 5000

export const rejectOnTimeout = async (
  promise: Promise<any>,
  ms: number,
): Promise<any> =>
  new Promise((resolve, reject) => {
    promise.then(
      (res: any) => resolve(res),
      (err: any) => reject(err),
    )
    setTimeout(() => {
      reject('timeout_error')
    }, ms)
  })

export const fetchParty = (id: string): Promise<Party> => {
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
          imageName: data.imageName ? data.imageName : '',
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

export const fetchUser = (id: string): Promise<User> => {
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
          imageName: data.imageName ? data.imageName : '',
          organizedParties: data.organizedParties || [],
          waitingRequests: data.waitingRequests || [],
          rejectedRequests: data.rejectedRequests || [],
          participation: data.participation || [],
        }
      }),
    maxExpectation,
  )
}

export const fetchUsers = async (ids: string[]): Promise<UsersObject> => {
  if (!ids) {
    return {}
  }
  return rejectOnTimeout(
    Promise.all(ids.map((id: string) => fetchUser(id))).then(
      (users: User[]) => {
        let res: UsersObject = {}
        users.forEach((user: User) => (res[user.id] = user))
        return res
      },
    ),
    maxExpectation,
  )
}

export const fetchAllPartiesIdsBesides = async (
  unwantedIds: string[] | null,
): Promise<string[]> => {
  return rejectOnTimeout(
    firebaseApp
      .database()
      .ref('parties')
      .once('value')
      .then((snapshot: any) => {
        const data = snapshot.val()
        if (!data) {
          return []
        }
        return Object.keys(data).filter(
          (key) => !(unwantedIds || []).includes(key),
        )
      }),
    maxExpectation,
  )
}
