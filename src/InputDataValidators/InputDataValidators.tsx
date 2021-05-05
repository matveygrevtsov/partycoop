import { coloredText, EditMyInfoFormInterface, Party, User } from '../DataTypes'

export const emailWarningText = (email: string): string => {
  const trimEmail = email.trim()
  if (!trimEmail) {
    return 'Empty email'
  }
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!re.test(trimEmail.toLowerCase())) {
    return 'Please enter a valid email'
  }
  return ''
}

export const fullNameWarningText = (fullName: string): string => {
  const trimFullName = fullName.trim()
  if (!trimFullName) {
    return 'Empty Fullname'
  }
  if (trimFullName.split(' ').length < 2) {
    return 'Fullname must include at least two words'
  }
  if (!/^[a-zA-Z ]+$/.test(trimFullName)) {
    return 'Please enter a valid Fullname'
  }
  if (trimFullName.length > 30) {
    return 'Full name must not exceed 30 characters'
  }

  if (/\d/g.test(trimFullName)) {
    return 'Numbers are not allowed in the Fullname'
  }
  return ''
}

export const ageWarningText = (age: string): string => {
  if (!age) {
    return 'Empty age'
  }
  const ageNumber = Number(age)
  if (
    isNaN(ageNumber) ||
    ageNumber < 0 ||
    (age[0] === age[1] && age[1] === '0')
  ) {
    return 'Wrong age'
  }
  return ''
}

export const correctInterval = (interval: [string, string]): string => {
  if (!interval[0] || !interval[1]) {
    return 'Empty'
  }
  if (interval[0][0] === interval[0][1] && interval[0][1] === '0') {
    return 'Wrong'
  }
  const value1 = Number(interval[0])
  const value2 = Number(interval[1])
  if (isNaN(value1) || isNaN(value2)) {
    return 'Wrong'
  }
  if (value1 < 0 || value1 > value2) {
    return 'Wrong'
  }
  return ''
}

export const isInvalidInputDate = (inputDate: string): boolean => {
  let values = inputDate.split('-').map((value: string) => Number(value))
  const date1 = new Date(values[0], values[1] - 1, values[2], 11, 59, 59, 999)
  const date2 = new Date()
  if (date1.getTime() < date2.getTime()) {
    return true
  }
  return false
}

export const requestForParticipationWarning = (
  party: Party,
  user: User,
): coloredText => {
  if (party.waitingRequests.includes(user.id)) {
    return { text: 'Your request has been sent!', color: '#198754' }
  }
  if (party.guests.includes(user.id)) {
    return { text: 'You are a guest', color: '#198754' }
  }
  if (party.author === user.id) {
    return { text: 'You are the author', color: '#198754' }
  }
  if (party.rejectedRequests.includes(user.id)) {
    return {
      text: 'Unfortunately, your request has been rejected',
      color: '#dc3545',
    }
  }
  if (user.age < party.ageInterval[0] || user.age > party.ageInterval[1]) {
    return {
      text: 'Unfortunately, you are not in the age range',
      color: '#dc3545',
    }
  }
  if (party.guests.length === party.guestsNumberInterval[1]) {
    return {
      text: 'Unfortunately, there are too many participants',
      color: '#dc3545',
    }
  }
  return { text: '', color: '' }
}

export const correctEditMyInfoForm = (
  prevData: User,
  newData: EditMyInfoFormInterface,
): string => {
  if (!newData.fullName) {
    return 'Empty Fullname'
  }

  if (/\d/g.test(newData.fullName)) {
    return 'Numbers are not allowed in the Fullname'
  }

  if (newData.age < 0) {
    return 'Wrong age'
  }

  if (!newData.aboutMe) {
    return 'Empty about me info'
  }

  if (
    prevData.fullName === newData.fullName &&
    prevData.age === newData.age &&
    prevData.aboutMe === newData.aboutMe &&
    prevData.imageName === newData.imageName
  ) {
    return ' '
  }

  return ''
}
