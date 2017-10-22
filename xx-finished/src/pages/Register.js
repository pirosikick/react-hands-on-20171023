import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import findUser from '../findUser';

class Register extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    }).isRequired
  };
  static defaultProps = {};

  state = {
    authChecked: false,
    input: ''
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;

    if (!user) {
      this.props.history.replace('/login');
    }

    findUser(user.uid).then(user => {
      if (user) {
        this.props.history.replace('/');
      } else {
        this.setState({
          authChecked: true,
          input: user.displayName
        });
      }
    });
  }

  handleChange = e => {
    const { value } = e.target;
    this.setState({ input: value });
  };

  handleClick = () => {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    db
      .doc(`users/${user.uid}`)
      .set({
        uid: user.uid,
        name: this.state.input,
      })
      .then(() => {
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { authChecked, input } = this.state;

    if (!authChecked) {
      return <p>読み込み中...</p>;
    }

    return (
      <div>
        <h1>登録</h1>
        <p>
          名前:
          <input
            type="text"
            value={this.state.input}
            onChange={this.handleChange}
          />
        </p>
        <button onClick={this.handleClick}>登録</button>
      </div>
    );
  }
}

export default Register;
