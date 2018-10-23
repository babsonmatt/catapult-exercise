import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import ManagePage from './pages/Manage';
import HomePage from './pages/Home';
// import UserPage from './pages/User';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

class HeaderMenu extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Menu>
          <Menu.Item name="signup">
            <Link to="/signup">Sign Up</Link>
          </Menu.Item>
          <Menu.Item name="signin">
            <Link to="/signin">Sign In</Link>
          </Menu.Item>
          <Menu.Item name="home">
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item name="manage">
            <Link to="/manage">Manage Users</Link>
          </Menu.Item>
        </Menu>
        {this.props.children}
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route component={HeaderMenu} />
          <Switch>
            <Route exact path="/signin" component={SignInPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/manage" component={ManagePage} />
            {/* <Route exact path="/users/:id" component={UserPage} /> */}
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
