import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {
  Card,
  CardHeader,
  CardText,
} from 'material-ui/Card';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import 'firebase/firestore';
import * as firebase from 'firebase';
import Loading from '../Loading';
import './Room.css';

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
    }).isRequired,
  };

  state = {
    name: this.props.location.state && this.props.location.state.name,
    input: '',
    sending: false,
    messages: null,
    users: {
      [this.props.user.uid]: this.props.user,
    },
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
            const messages = snapshot.docs.map(doc => {
              const data = doc.data();

              return {
                ...data,
                id: doc.id,
                postedAt: new Date(data.postedAt).toLocaleDateString({
                  hours: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }),
              };
            });

            this.setState({ messages }, () => {
              this.scrollToBottom();
            });
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

  scrollToBottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  sendMessage = () => {
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
        photoURL: user.photoURL,
      },
    };
    messagesRef
      .add(message)
      .then(() => {
        this.setState({ input: '', sending: false }, () => {
          this.scrollToBottom();
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ sending: false });
      });
  };

  backToRoomList = () => {
    this.props.history.goBack();
  };

  render() {
    const { name, input, sending, messages } = this.state;
    const isInputEmpty = !input;

    return (
      <div>
        <AppBar
          className="Room__header"
          title={name || ''}
          iconElementLeft={
            <IconButton onClick={this.backToRoomList}>
              <NavigationChevronLeft/>
            </IconButton>
          }
        />

        <div className="Room__body">
          {Array.isArray(messages) ? (
            messages.map(message => (
              <Card key={`message-${message.id}`}>
                <CardHeader
                  title={message.user.displayName}
                  subtitle={message.postedAt}
                  avatar={message.user.photoURL}
                />
                <CardText>{message.text}</CardText>
              </Card>
            ))
          ) : (
            <Loading />
          )}
        </div>

        <Paper className="Room__footer" zDepth={3}>
          <TextField
            className="Room__textField"
            name="messageText"
            value={input}
            disabled={sending}
            onChange={this.handleChange}
          />
          <RaisedButton
            label="送信"
            primary={true}
            disabled={sending || isInputEmpty}
            onClick={this.sendMessage}
          />
        </Paper>
      </div>
    );
  }
}

export default Room;
