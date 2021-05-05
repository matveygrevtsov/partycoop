import { CreatePartyFormInterface } from '../DataTypes'
import { correctInterval, isInvalidInputDate } from './InputDataValidators'

export const createPartyFormValidator = (
  party: CreatePartyFormInterface,
): string => {
  if (
    !party.name &&
    !party.ageInterval[0] &&
    !party.ageInterval[1] &&
    !party.guestsNumberInterval[0] &&
    !party.guestsNumberInterval[1] &&
    !party.name &&
    !party.meetingPoint &&
    !party.description &&
    !party.meetingTime
  ) {
    return ' '
  }

  const trimPartyName = party.name.trim()

  if (!trimPartyName) {
    return 'Empty name'
  }

  if (trimPartyName.length > 30) {
    return 'Party name must not exceed 30 characters'
  }

  const ageIntervalWarning = correctInterval(party.ageInterval)

  if (ageIntervalWarning) {
    return ageIntervalWarning + ' age interval'
  }

  const guestsIntervalWarning = correctInterval(party.guestsNumberInterval)

  if (guestsIntervalWarning) {
    return guestsIntervalWarning + ' guests number interval'
  }

  if (!party.meetingPoint.trim()) {
    return 'Empty meeting point!'
  }

  if (!party.description.trim()) {
    return 'Empty description!'
  }

  if (!party.meetingTime) {
    return 'Please schedule a meeting time.'
  }

  if (isInvalidInputDate(party.meetingTime)) {
    return 'The party must be scheduled at least one day in advance!'
  }

  return ''
}
