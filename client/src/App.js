import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import ManagePage from './pages/Manage';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/manage" component={ManagePage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
