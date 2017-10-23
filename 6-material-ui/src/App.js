import React, { Component } from 'react';
import * as firebase from 'firebase';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import UserOnlyRoute from './UserOnlyRoute';
import Login from './pages/Login';
import RoomList from './pages/RoomList';
import Room from './pages/Room';

class App extends Component {
  state = {
    authStateChecked: false,
    user: null,
  };

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(() => {
      this.setState({ authStateChecked: true });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { authStateChecked } = this.state;

    if (!authStateChecked) {
      return <p>読み込み中...</p>;
    }

    return (
      <MuiThemeProvider>
        <HashRouter>
          <div>
            <Switch>
              <UserOnlyRoute path="/" exact component={RoomList} />
              <UserOnlyRoute path="/room/:id" component={Room} />
              <Route path="/login" component={Login} />
              <Redirect to="/" />
            </Switch>
          </div>
        </HashRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
