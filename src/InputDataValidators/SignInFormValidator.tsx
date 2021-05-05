import { emailWarningText } from './InputDataValidators'

export const signInFormValidator = (email: string, passwordLength: number) => {
  if (!email && passwordLength === 0) {
    return ' '
  }
  const emailWarning: string = emailWarningText(email)
  if (emailWarning) {
    return emailWarning
  }
  if (passwordLength < 6) {
    return 'Your password must contain at least 6 characters'
  }
  return ''
}
