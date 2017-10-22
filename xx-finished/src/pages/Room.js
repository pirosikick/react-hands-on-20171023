import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'firebase/firestore';
import * as firebase from 'firebase';

class Room extends Component {
  static propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      photoURL: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
      isExact: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      state: PropTypes.object,
    }).isRequired
  };

  state = {
    name: this.props.location.state && this.props.location.state.name,
    input: '',
    sending: false,
    messages: null,
    users: {
      [this.props.user.uid]: this.props.user
    }
  };

  componentDidMount() {
    const history = this.props.history;
    const roomId = this.props.match.params.id;
    const db = firebase.firestore();
    const roomRef = db.doc(`rooms/${roomId}`);

    roomRef
      .get()
      .then(doc => {
        if (!this.state.name) {
          this.setState({
            name: doc.data().name,
          });
        }

        this.unsubscribe = roomRef
          .collection('messages')
          .orderBy('postedAt')
          .onSnapshot(snapshot => {
            const messages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log(messages);
            this.setState({ messages });
          });
      })
      .catch(err => {
        if (err.code === 'not-found') {
          history.replace('/');
          return;
        }

        console.log(err);
      });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  handleClick = () => {
    this.setState({ sending: true });

    const user = this.props.user;
    const roomId = this.props.match.params.id;
    const db = firebase.firestore();
    const messagesRef = db.collection(`rooms/${roomId}/messages`);

    const message = {
      text: this.state.input,
      postedAt: Date.now(),
      user: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
    };
    messagesRef.add(message).then(() => {
      this.setState({ input: '', sending: false });
    }).catch(error=>{
      console.log(error);
      this.setState({ sending: false });
    });
  };

  render() {
    const { name, input, sending, messages } = this.state;

    return (
      <div>
        <h1>{name || ''}</h1>
        {Array.isArray(messages) ? (
          <ul>{messages.map(message => <li key={`message-${message.id}`}>{message.text} by {message.user.displayName} at {message.postedAt}</li>)}</ul>
        ) : (
          <p>読み込み中...</p>
        )}
        <textarea value={input} disabled={sending} onChange={this.handleChange} />
        <button onClick={this.handleClick} disabled={sending}>送信</button>
      </div>
    );
  }
}

export default Room;
