import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import ManagePage from './pages/Manage';
import HomePage from './pages/Home';
import UserPage from './pages/User';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/manage" component={ManagePage} />
          {/* <Route exact path="/users/:id" component={UserPage} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
