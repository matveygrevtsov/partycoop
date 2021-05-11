import React, { useEffect, useState } from 'react'
import firebaseApp from './firebaseApp'
import PagePreloader from './components/PagePreloader/PagePreloader'
import { fetchUser } from './firebaseAPIhelpers/fetchFunctions'
import { User } from './DataTypes'

export const AuthContext = React.createContext<any>([[], () => null])

/* Компонента для хранения статуса (выполнен вход или нет ) */

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [pending, setPending] = useState(true) // ожидание
  const [userData, setUserData] = useState({})

  const updateCurrentUserData = (values: object) =>
    setUserData({ ...userData, ...values })

  const refetchData = () => {
    if (currentUser) {
      fetchUser(currentUser.uid).then((user: User) => setUserData(user))
    }
  }

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, []) // вызываем каждый раз, когда в firebase меняется статус user

  useEffect(() => {
    if (currentUser) {
      fetchUser(currentUser.uid).then((user: User) => setUserData(user))
    }
  }, [currentUser])

  return pending ? (
    <PagePreloader />
  ) : (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        updateCurrentUserData,
        refetchData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
