export type Party = {
  id: string
  ageInterval: [number, number]
  author: string
  description: string
  guestsNumberInterval: [number, number]
  imageName: string
  meetingPoint: string
  meetingTime: string
  name: string
  guests: string[]
  waitingRequests: string[]
  rejectedRequests: string[]
}

export type User = {
  aboutMe: string
  age: number
  fullName: string
  id: string
  imageName: string
  organizedParties: string[]
  waitingRequests: string[]
  rejectedRequests: string[]
  participation: string[]
}

export type UsersObject = {
  [key: string]: User
}
