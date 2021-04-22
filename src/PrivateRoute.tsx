import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import NavBar from './components/NavBar/NavBar'

const PrivateRoute: React.FC<any> = ({
  component: RouteComponent,
  ...rest
}) => {
  const { currentUser } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          <>
            <NavBar />
            <RouteComponent {...routeProps} />
          </>
        ) : (
          <Redirect to={'/welcome'} />
        )
      }
    />
  )
}

export default PrivateRoute
