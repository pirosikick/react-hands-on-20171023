// react, react-domのimport
import React from 'react';
import ReactDOM from 'react-dom';
// webpackのstyle-loaderによって、
// CSSのimportが可能。ページに読み込み後、<head>タグに挿入される
import './index.css';
// Appコンポーネント
import App from './App';
// Service Workerの登録。今回は解説しません
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render
// 第1引数の要素（React Element）を第2引数の要素に描画
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
