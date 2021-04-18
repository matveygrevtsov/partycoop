import React, { useEffect, useState } from 'react'
import firebaseApp from './firebaseApp'
import Preloader from './components/Preloader/Preloader'

export const AuthContext = React.createContext<any>([[], () => null])

/* Компонента для хранения статуса (выполнен вход или нет ) */

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true) // ожидание

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, []) // вызываем каждый раз, когда в firebase меняется статус user

  return pending ? (
    <Preloader />
  ) : (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
