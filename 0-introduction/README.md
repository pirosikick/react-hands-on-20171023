<!-- vim: set nofoldenable: -->

# イントロダクション

ハンズオンに入る前に、使う技術の概要や、作るものについて説明します。

## React

https://reactjs.org/

Reactは、Facebook製の **UIを構築するためのライブラリ** です。MVCでいうとViewの部分のみで、フレームワークではありません。

### Reactの特徴

Reactは、以下のような特徴があります。

- コンポーネント指向
- JSX
- Virtual DOM

#### コンポーネント指向

要素の固まりをコンポーネントとして定義し、コンポーネント同士を組み合わせてUIを構築します。

```js
// 例）ToDoアプリの構築
// 3つのコンポーネントを組みあせて一つのアプリケーションの作る
import React, { Component } from 'react';

function TodoItem({ task }) {
  return <span>{task}</span>;
}

function TodoForm({ text, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" text={text} onChange={onChange} />
      <button type="submit">登録</button>
    </form>
  );
}

class TodoApp extends Component {
  state = {
    input: '',
    tasks: []
  };

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      input: '',
      tasks: this.state.tasks.concat(this.state.input)
    });
  }

  render() {
    const { input, tasks } = this.state;

    return (
      <div>
        <ul>{
          tasks.map(task => <TodoItem task={task} />)
        }</ul>
        <TodoForm
          text={input}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
```

OSSで公開されているコンポーネントも多くあります。

#### JSX

JSXとは、JavaScriptにHTMLタグ（のようなもの）を記述できるように拡張した言語です。

```js
function User({ name, imageURL }) {
  return (
    <div>
      <img className="image" src={imageURL} />
      <span className="name">{name}</span>
    </div>
  );
}
```

最初は気持ち悪く感じるかもしれませんが、このUserコンポーネントが出力するUIの構造は一目瞭然で、アプリケーションの見通しが非常によくなります。また、当たり前ですが、このままではブラウザ上で実行できません。トランスパイラーと呼ばれるツールで、JSXで記述されたコードを普通のJavaScriptのコードに変換する必要があります。

#### Virtual DOM（仮想DOM）

Reactは、描画の処理にVirtual DOMを使っています。Virtual DOMとは、内部で仮想的なDOMツリーを構築し、その仮想的なDOMツリー同士を比較、差分を本物のDOMに反映します。

下記のサンプルは、二度ReactDOM.render関数を呼び出しており、同じような要素の構造が二度描画されているように見えますが、2回目の呼び出しでは1回目の呼び出し時に構築された仮想的なDOMツリーと比較した差分のみを本物のDOMツリーに反映します。（今回のサンプルではpタグの変更のみを反映）

```js
// 1回目の描画
ReactDOM.render(
  <div>
    <h1>Hello, World!!!!</h1>
    <p>This is first rendering</p>
  </div>,
  document.getElementById('root')
);

// 2回目の描画
// 1回目の描画時に生成された仮想DOMと比較した差分のみを本物のDOMに反映
ReactDOM.render(
  <div>
    <h1>Hello, World!!!!</h1>
    <p>This is second rendering</p>
  </div>,
  document.getElementById('root')
);
```

## Firebase

https://firebase.google.com/?hl=ja

Firebaseとは、2014年にGoogleに買収されたMBaaS（Mobile Backend as a Service）です。WebだけではなくiOSやAndroid、Golangなど向けにSDKが提供されています。Firebaseを利用することでサーバレスにアプリケーションを作成することが出来ます。様々な機能が提供されていますが、今回は下記の3つの機能を利用します。

- firestore
  - リアルタイム性の高いNoSQL型のデータストア
  - Webチャットなど、接続しているクライアント同士でリアルタイムなデータのやり取りをしたい場合に有用
- auth
  - SNS認証やメール認証、ユーザのセッション管理を提供
- hosting
  - アプリケーションのホスティングサービス

## 本日作るもの

シンプルなWebチャットアプリを作ります。下記に完成品を公開しています。（ハンズオン後に停止します）

https://test-app-20171023.firebaseapp.com/

下記の機能が実装されています。ハンズオン用に機能を絞りましたので、シンプルな作りになっています。

- ログイン機能
  - Googleアカウントによる認証
- 部屋一覧機能
- 部屋作成機能
- チャット機能
  - テキストの送信のみ実装

Firebaseを使うことで、簡単＆サーバレスにWebアプリケーションを作成・公開することが可能です。このハンズオンを通して、アイデアを形にするきっかけになれば幸いです。
