import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home/Home'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import Welcome from './pages/Welcome/Welcome'
import { AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import UserPage from './pages/UserPage/UserPage'
import PartyPage from './pages/PartyPage/PartyPage'
import Requests from './pages/Requests/Requests'
import CreatePartyPage from './pages/CreatePartyPage/CreatePartyPage'
import OrganizedAndParticipationPartiesPage from './pages/OrganizedAndParticipationPartiesPage/OrganizedAndParticipationPartiesPage'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import AllParties from './pages/AllParties/AllParties'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Switch>
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />

            <PrivateRoute exact path="/allparties" component={AllParties} />
            <PrivateRoute
              exact
              path="/organized_and_participation/:userId"
              component={OrganizedAndParticipationPartiesPage}
            />
            <PrivateRoute exact path="/requests" component={Requests} />
            <PrivateRoute exact path="/user/:userId" component={UserPage} />
            <PrivateRoute exact path="/party/:partyId" component={PartyPage} />
            <PrivateRoute
              exact
              path="/createparty"
              component={CreatePartyPage}
            />
            <PrivateRoute exact path="/settings" component={Home} />

            <Route exact path="/" component={Welcome} />

            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App
