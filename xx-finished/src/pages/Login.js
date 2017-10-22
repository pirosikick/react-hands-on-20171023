import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import isUserRegistered from '../findUser';

class Login extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    error: false,
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;

    if (user) {
      this.props.history.replace('/');
    }
  }

  handleClick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ user }) => {
        const db = firebase.firestore();
        return db.doc(`users/${user.uid}`).add({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      })
      .then(() => {
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log('failed to log in', err);
        this.setState({ error: true });
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div>
        {error ? <p>ログインエラー</p> : ''}
        <button onClick={this.handleClick}>ログイン</button>
      </div>
    );
  }
}

export default Login;
