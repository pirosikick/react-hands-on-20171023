<!-- vim: set nofoldenable: -->

# 部屋ページだけを作る

一気に複数ページを作るのは大変なので、まず部屋ページだけを実装し感覚を掴みます。

## 手順

1. `src/pages/Room.js`を作成する
2. `src/App.js`で呼び出す

### `src/pages/Room.js`を作成する

実際のコードを参考に実装してみましょう

### `src/App.js`で呼び出す

実際のコードを参考に実装してみましょう

## ES2015以降の文法

[class field](https://github.com/tc39/proposal-class-fields)という新しい構文を使っています。

### クラスのプロパティの初期化

`src/pages/Room.js`の中で下記のようにstateを初期化しているコードがあります。

```js
class Room extends Component {
  state = {
    name: 'チャット部屋',
    input: '',
    messages: [],
  };

  ...
```

これは、下記のようにconstructorで初期化するコードと同義です。

```js
class Room extends Component {
  constructor(props) {
    this.state = {
      name: 'チャット部屋',
      input: '',
      messages: [],
    };
  }

  ...
```

### クラスのメソッドにthisをbindする

`src/pages/Room.js`の中で下記のようにhandleChangeやsendMessageを定義しています。

```js
class Room extends Component {
  ...

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  // メッセージを投稿する処理
  sendMessage = () => {
    const postedAt = new Date();
    const message = {
      id: postedAt.getTime(),
      text: this.state.input,
      postedAt: postedAt.toLocaleDateString()
    };

    this.setState({
      input: '',
      messages: this.state.messages.concat(message)
    });
  };

  ...
```

これは、下記のようにconstructor内でthisを各関数にbindしているのと同義です。JavaScriptの厄介な部分で、関数のthisは呼び出し方によって参照するものが変化します。bind(this)と明示的に記述することで、呼び出し時のthisを保証しています。

```js
class Room extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleChange() { ... }
  sendMessage() { ... }

```


