import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import RoomList from './pages/RoomList';
import Room from './pages/Room';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route path="/" exact component={RoomList} />
            <Route path="/room/:id" component={Room} />
            <Route path="/login" component={Login} />
            <Redirect to="/" />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
