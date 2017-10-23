## 前ステップとの差分

```diff
diff -ru 4-routing/src/App.js 5-use-firebase/src/App.js
--- 4-routing/src/App.js	2017-10-23 16:56:52.000000000 +0900
+++ 5-use-firebase/src/App.js	2017-10-23 12:05:49.000000000 +0900
@@ -1,18 +1,54 @@
 import React, { Component } from 'react';
+import * as firebase from 'firebase';
 import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
 import './App.css';
+import UserOnlyRoute from './UserOnlyRoute';
 import Login from './pages/Login';
 import RoomList from './pages/RoomList';
 import Room from './pages/Room';
 
 class App extends Component {
+  state = {
+    // 認証状態の初期化が終わったかのフラグ
+    authStateChecked: false
+  };
+
+  componentDidMount() {
+    /**
+     * 認証状態の変更を監視
+     * このcallbackが実行されたタイミングでfirebase.auth()の初期化が終わり、
+     * firebase.auth().currentUserにログインユーザの情報が定義される
+     *
+     * 返り値は監視を止めるための関数なので、保持しておく
+     */
+    this.unsubscribe = firebase.auth().onAuthStateChanged(() => {
+      // 認証状態の初期化が終わったのでフラグを立てる
+      this.setState({ authStateChecked: true });
+    });
+  }
+
+  componentWillUnmount() {
+    // このコンポーネントがDOMから切り離される際に監視を止める
+    if (this.unsubscribe) {
+      this.unsubscribe();
+    }
+  }
+
   render() {
+    const { authStateChecked } = this.state;
+
+    if (!authStateChecked) {
+      // 認証状態の初期化が終わっていない
+      return <p>読み込み中...</p>;
+    }
+
     return (
       <HashRouter>
         <div>
           <Switch>
-            <Route path="/" exact component={RoomList} />
-            <Route path="/room/:id" component={Room} />
+            {/* UserOnlyRouteはログイン状態でないとアクセスできない */}
+            <UserOnlyRoute path="/" exact component={RoomList} />
+            <UserOnlyRoute path="/room/:id" component={Room} />
             <Route path="/login" component={Login} />
             <Redirect to="/" />
           </Switch>
Only in 5-use-firebase/src: UserOnlyRoute.js
diff -ru 4-routing/src/pages/Login.js 5-use-firebase/src/pages/Login.js
--- 4-routing/src/pages/Login.js	2017-10-23 16:44:35.000000000 +0900
+++ 5-use-firebase/src/pages/Login.js	2017-10-23 12:28:32.000000000 +0900
@@ -1,5 +1,6 @@
 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
+import * as firebase from 'firebase';
 
 /**
  * ログインページ
@@ -11,14 +12,44 @@
     }).isRequired,
   };
 
+  state = {
+    error: false,
+  };
+
+  componentDidMount() {
+    const user = firebase.auth().currentUser;
+
+    if (user) {
+      // ログイン済みの場合はリダイレクト
+      this.props.history.replace('/');
+    }
+  }
+
   handleClick = () => {
-    // トップページへリダイレクト
-    this.props.history.replace('/');
+    // Google認証のダイアログを開く
+    const provider = new firebase.auth.GoogleAuthProvider();
+
+    firebase
+      .auth()
+      .signInWithPopup(provider)
+      .then((/* result */) => {
+        // 認証完了
+        // result.userからログイン情報を取得可能
+        this.props.history.replace('/');
+      })
+      .catch(err => {
+        // 認証エラー
+        console.log('failed to log in', err);
+        this.setState({ error: true });
+      });
   };
 
   render() {
+    const { error } = this.state;
+
     return (
       <div>
+        {error ? <p>ログインエラー</p> : ''}
         <button onClick={this.handleClick}>Googleアカウントでログイン</button>
       </div>
     );
diff -ru 4-routing/src/pages/Room.js 5-use-firebase/src/pages/Room.js
--- 4-routing/src/pages/Room.js	2017-10-23 16:28:10.000000000 +0900
+++ 5-use-firebase/src/pages/Room.js	2017-10-23 13:30:07.000000000 +0900
@@ -1,8 +1,15 @@
 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
+import 'firebase/firestore';
+import * as firebase from 'firebase';
 
 class Room extends Component {
   static propTypes = {
+    user: PropTypes.shape({
+      uid: PropTypes.string.isRequired,
+      displayName: PropTypes.string.isRequired,
+      photoURL: PropTypes.string.isRequired,
+    }).isRequired,
     match: PropTypes.shape({
       params: PropTypes.object.isRequired,
       isExact: PropTypes.bool.isRequired,
@@ -15,32 +22,99 @@
   };
 
   state = {
-    name: 'チャット部屋',
+    // 部屋名、部屋一覧から引き継いでいる場合はそちらを使う
+    name: this.props.location.state && this.props.location.state.name,
     input: '',
-    messages: [],
+    sending: false,
+    messages: null,
   };
 
+  componentDidMount() {
+    const history = this.props.history;
+    const roomId = this.props.match.params.id;
+    const db = firebase.firestore();
+    const roomRef = db.doc(`rooms/${roomId}`);
+
+    roomRef
+      .get()
+      .then(doc => {
+        if (!this.state.name) {
+          this.setState({
+            name: doc.data().name,
+          });
+        }
+
+        this.unsubscribe = roomRef
+          .collection('messages')
+          .orderBy('postedAt')
+          .onSnapshot(snapshot => {
+            const messages = snapshot.docs.map(doc => {
+              const data = doc.data();
+
+              return {
+                ...data,
+                id: doc.id,
+                postedAt: new Date(data.postedAt).toLocaleDateString({
+                  hours: 'numeric',
+                  minute: 'numeric',
+                  second: 'numeric',
+                }),
+              };
+            });
+
+            this.setState({ messages });
+          });
+      })
+      .catch(err => {
+        if (err.code === 'not-found') {
+          history.replace('/');
+          return;
+        }
+
+        console.log(err);
+      });
+  }
+
+  componentWillUnmount() {
+    if (this.unsubscribe) {
+      this.unsubscribe();
+    }
+  }
+
   handleChange = e => {
     this.setState({ input: e.target.value });
   };
 
-  // メッセージを投稿する処理
   sendMessage = () => {
-    const postedAt = new Date();
+    this.setState({ sending: true });
+
+    const user = this.props.user;
+    const roomId = this.props.match.params.id;
+    const db = firebase.firestore();
+    const messagesRef = db.collection(`rooms/${roomId}/messages`);
+
     const message = {
-      id: postedAt.getTime(),
       text: this.state.input,
-      postedAt: postedAt.toLocaleDateString()
+      postedAt: Date.now(),
+      user: {
+        uid: user.uid,
+        displayName: user.displayName,
+        photoURL: user.photoURL,
+      },
     };
-
-    this.setState({
-      input: '',
-      messages: this.state.messages.concat(message)
-    });
+    messagesRef
+      .add(message)
+      .then(() => {
+        this.setState({ input: '', sending: false });
+      })
+      .catch(error => {
+        console.log(error);
+        this.setState({ sending: false });
+      });
   };
 
   render() {
-    const { name, input, messages } = this.state;
+    const { name, input, sending, messages } = this.state;
     const isInputEmpty = !input;
 
     return (
@@ -48,13 +122,19 @@
         <h1>{name || ''}</h1>
 
         <ul>
-          {
+          {Array.isArray(messages) ? (
             messages.map(message => (
               <li key={`message-${message.id}`}>
-                {message.text} {message.postedAt}
+                {message.user.displayName} {message.postedAt}
+                <br />
+                <img src={message.user.displayName} width="50" />
+                <br />
+                {message.text}
               </li>
             ))
-          }
+          ) : (
+            <p>読み込み中...</p>
+          )}
         </ul>
 
         <div>
@@ -63,9 +143,10 @@
             cols="30"
             rows="10"
             value={input}
+            disabled={sending}
             onChange={this.handleChange}
           />
-          <button disabled={isInputEmpty} onClick={this.sendMessage}>
+          <button disabled={sending || isInputEmpty} onClick={this.sendMessage}>
             送信
           </button>
         </div>
diff -ru 4-routing/src/pages/RoomList.js 5-use-firebase/src/pages/RoomList.js
--- 4-routing/src/pages/RoomList.js	2017-10-23 16:23:20.000000000 +0900
+++ 5-use-firebase/src/pages/RoomList.js	2017-10-23 12:37:16.000000000 +0900
@@ -1,5 +1,7 @@
 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
+import 'firebase/firestore';
+import * as firebase from 'firebase';
 
 class RoomList extends Component {
   static propTypes = {
@@ -9,9 +11,24 @@
   };
 
   state = {
-    rooms: [],
+    rooms: undefined,
   };
 
+  componentDidMount() {
+    const db = firebase.firestore();
+    const roomsRef = db.collection('rooms');
+
+    // 部屋情報の変更を監視
+    this.unsubscribe = roomsRef.onSnapshot(snapshot => {
+      const rooms = snapshot.docs.map(doc => ({
+        id: doc.id,
+        ...doc.data(),
+      }));
+
+      this.setState({ rooms });
+    });
+  }
+
   componentWillUnmount() {
     if (this.unsubscribe) {
       this.unsubscribe();
@@ -24,19 +41,13 @@
       return;
     }
 
-    const room = {
-      id: Date.now(),
-      name: roomName
-    };
-    this.setState({ rooms: this.state.rooms.concat(room) })
+    const db = firebase.firestore();
+    const room = { name: roomName };
+    db.collection('rooms').add(room);
   };
 
-  enterRoom = room => {
-    // 部屋ページに遷移
-    // 第2引数に遷移先に状態を渡すことが出来る
-    this.props.history.push(`/room/${room.id}`, {
-      name: room.name
-    });
+  enterRoom = roomId => {
+    this.props.history.push(`/room/${roomId}`);
   };
 
   render() {
@@ -54,7 +65,7 @@
           {rooms.map(room => (
             <li key={`room-${room.id}`}>
               {room.name}
-              <button onClick={() => this.enterRoom(room)}>入室する</button>
+              <button onClick={() => this.enterRoom(room.id)}>入室する</button>
             </li>
           ))}
         </ul>
```
