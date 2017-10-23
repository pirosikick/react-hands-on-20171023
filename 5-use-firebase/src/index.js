import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig.json';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// firebaseを初期化
// firebaseのコンソールに表示されるJSONをコピーしてくる
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, root);
registerServiceWorker();
