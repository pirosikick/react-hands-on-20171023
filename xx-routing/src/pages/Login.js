import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ログインページ
 */
class Login extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleClick = () => {
    // トップページへリダイレクト
    this.props.history.replace('/');
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Googleアカウントでログイン</button>
      </div>
    );
  }
}

export default Login;
