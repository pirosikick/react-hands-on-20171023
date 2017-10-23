<!-- vim: set nofoldenable: -->

# ページルーティング

シングルページアプリケーションらしく、複数のページを扱えるようにします。

## 手順

1. react-router-domのインストール
2. 各ページ実装する
3. ルーティングを設定する
4. ナビゲーションを実装する

### react-router-domのインストール

https://reacttraining.com/react-router/

react-routerは、Reactでページルーティングを行うためのライブラリです。

```js
# npmの場合
$ npm install --save react-router-dom

# yarnの場合
$ yarn add react-router-dom
```

特徴としては、ページルーティングの設定もReactのコンポーネントを使って表現するところです。（後述）

### 各ページを実装する

以下のページを作ります。自分で書けるぞ！という人はどんどん書いていただいてOKですが、悩む人は一旦このリポジトリにあるファイルを写経するか、差分を参考に記述しましょう。

- ログインページ ... `pages/Login.js`
- 部屋一覧ページ ... `pages/RoomList.js`
- 部屋ページ ... `pages/Room.js`

### ルーティングを設定する

ルーティングとは、「ユーザが/loginにアクセスしたらログインページを描画する」といった設定のことです。今回は、

- `/login` ... ログインページ
- `/` ... 部屋一覧ページ
- `/room/部屋のID` ... 部屋ページ

のような設定にしたいと思います。結果からお見せしますと下記のような記述をApp.jsに行います。

```js
// App.js
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
```

#### Routeコンポーネント

Routeコンポーネントは、ルート（`/`や`/login`）とReactコンポーネントの紐付けを行います。注意すべきはpathは前方一致なので、`path="/"`としている場合、`/`にも`/login`にもマッチすることになってしまいます。そういう場合は`exact`をつけて、pathの値と完全一致した場合にマッチするようにします。

```js
{/* '/'にしかマッチしない */}
<Route path="/" exact component={RoomList} />
```

#### Redirectコンポーネント

リダイレクトするコンポーネントです。存在しないURLに対処するためのコンポーネントです。

#### Switchコンポーネント

子要素のうちマッチしたRoute、 **１つのみ** を描画します。例えば、下記のようにSwitchを使わない場合、必ずRedirectも描画されてしまうので、どこにアクセスしても`/`が表示されてしまいます。

```js
    return (
      <HashRouter>
        <div>
          <Route path="/" exact component={RoomList} />
          <Route path="/room/:id" component={Room} />
          <Route path="/login" component={Login} />
          <Redirect to="/" />
        </div>
      </HashRouter>
    );
  }
```

#### HashRouterコンポーネント

HashRouterコンポーネントを使うと、URLのハッシュ値（`#/hogehoge`）を使ってルーティングの管理を行います。他にも、

- BrowserRouter
  - ブラウザのhistory APIを使ってURLを完全に書き換えます。
  - このルーターを使う場合、サーバサイドで全てのルーティングの一つのページに割り当てる処理が必要になります。
- MemoryRouter
  - メモリ上でルーティングの管理を行います。URLの書き換えは起こりません。
  - よって、メモリ上の情報を保存するすべがない場合は、今までの履歴を破棄し、リロードすると最初のページからになってしまいます
  - また、ブラウザの戻る・進むボタンは使えません。

などがあります。

#### 各ページのComponentに渡されるprops

RoomListやRoomなどのRouteコンポーネントのcomponentに渡されたコンポーネントには、下記のpropsが渡されます。

- history
  - ルーティングを操作するメソッドが提供されている
  - `history.push(path)` ... pathに遷移
  - `history.replace(path)` ... 現在のルートを指定したpathに置き換える
  - `history.goBack()`, `history.goForward()` ... 戻る、進む
- location
  - `location.pathname`
  - `location.search`
  - `location.hash`
  - `location.state`
- match

## 前ステップとの差分

TODO

## ES2015以降の構文

TODO

## 補足
