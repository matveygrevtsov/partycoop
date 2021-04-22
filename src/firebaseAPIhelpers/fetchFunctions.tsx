import firebaseApp from '../firebaseApp'

export async function fetchParty(id: string) {
  return firebaseApp
    .database()
    .ref('parties/' + id)
    .once('value')
    .then((snapshot) => {
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
    })
}

export async function fetchUser(id: string) {
  return firebaseApp
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
    })
    .catch((err) => {
      console.log(err)
    })
}

export async function fetchUsers(ids: string[]) {
  return Promise.all(ids.map((id: string) => fetchUser(id))).then(
    (users: any) => {
      let res: any = {}
      users.forEach((user: any) => (res[user.id] = user))
      return res
    },
  )
}

export async function fetchAllPartiesIds() {
  return firebaseApp
    .database()
    .ref('parties')
    .once('value')
    .then((snapshot) => {
      return Object.keys(snapshot.val())
    })
    .catch((err) => {
      console.log(err)
    })
}

