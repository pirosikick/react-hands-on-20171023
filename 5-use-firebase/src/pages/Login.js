import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

/**
 * ログインページ
 */
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
      // ログイン済みの場合はリダイレクト
      this.props.history.replace('/');
    }
  }

  handleClick = () => {
    // Google認証のダイアログを開く
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((/* result */) => {
        // 認証完了
        // result.userからログイン情報を取得可能
        this.props.history.replace('/');
      })
      .catch(err => {
        // 認証エラー
        console.log('failed to log in', err);
        this.setState({ error: true });
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div>
        {error ? <p>ログインエラー</p> : ''}
        <button onClick={this.handleClick}>Googleアカウントでログイン</button>
      </div>
    );
  }
}

export default Login;
