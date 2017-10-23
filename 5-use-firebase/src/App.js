import React, { Component } from 'react';
import * as firebase from 'firebase';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import UserOnlyRoute from './UserOnlyRoute';
import Login from './pages/Login';
import RoomList from './pages/RoomList';
import Room from './pages/Room';

class App extends Component {
  state = {
    // 認証状態の初期化が終わったかのフラグ
    authStateChecked: false
  };

  componentDidMount() {
    /**
     * 認証状態の変更を監視
     * このcallbackが実行されたタイミングでfirebase.auth()の初期化が終わり、
     * firebase.auth().currentUserにログインユーザの情報が定義される
     *
     * 返り値は監視を止めるための関数なので、保持しておく
     */
    this.unsubscribe = firebase.auth().onAuthStateChanged(() => {
      // 認証状態の初期化が終わったのでフラグを立てる
      this.setState({ authStateChecked: true });
    });
  }

  componentWillUnmount() {
    // このコンポーネントがDOMから切り離される際に監視を止める
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { authStateChecked } = this.state;

    if (!authStateChecked) {
      // 認証状態の初期化が終わっていない
      return <p>読み込み中...</p>;
    }

    return (
      <HashRouter>
        <div>
          <Switch>
            {/* UserOnlyRouteはログイン状態でないとアクセスできない */}
            <UserOnlyRoute path="/" exact component={RoomList} />
            <UserOnlyRoute path="/room/:id" component={Room} />
            <Route path="/login" component={Login} />
            <Redirect to="/" />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
