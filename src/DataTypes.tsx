export interface Party {
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

export interface User {
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

export interface UsersObject {
  [key: string]: User
}

export interface SignUpInputInterface {
  email: string
  fullName: string
  age: string
  aboutMe: string
  passwordLength: number
}

export interface CreatePartyFormInterface {
  author: string
  imageName: string
  ageInterval: [string, string]
  guestsNumberInterval: [string, string]
  name: string
  meetingPoint: string
  description: string
  meetingTime: string
}

export interface coloredText {
  text: string
  color: string
}

export interface EditMyInfoFormInterface {
  fullName: string
  age: number
  aboutMe: string
  imageName: string
}
