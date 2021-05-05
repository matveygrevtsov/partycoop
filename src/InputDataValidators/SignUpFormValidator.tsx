import { SignUpInputInterface } from '../DataTypes'
import {
  emailWarningText,
  fullNameWarningText,
  ageWarningText,
} from './InputDataValidators'

export const signUpFormValidator = (
  inputData: SignUpInputInterface,
): string => {
  if (
    !inputData.email &&
    inputData.passwordLength < 1 &&
    !inputData.fullName &&
    !inputData.age &&
    !inputData.aboutMe
  ) {
    return ' '
  }
  const emailWarning: string = emailWarningText(inputData.email)
  if (emailWarning) {
    return emailWarning
  }
  if (inputData.passwordLength < 6) {
    return 'Your password must contain at least 6 characters'
  }

  const fullNameWarning: string = fullNameWarningText(inputData.fullName)
  if (fullNameWarning) {
    return fullNameWarning
  }
  const ageWarning = ageWarningText(inputData.age)
  if (ageWarning) {
    return ageWarning
  }

  if (!inputData.aboutMe.trim()) {
    return 'Empty about you information'
  }
  return ''
}
