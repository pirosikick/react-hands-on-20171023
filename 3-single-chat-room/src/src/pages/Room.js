import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Room extends Component {
  static propTypes = {
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
    name: 'チャット部屋',
    input: '',
    messages: [],
  };

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

  render() {
    const { name, input, messages } = this.state;
    const isInputEmpty = !input;

    return (
      <div>
        <h1>{name || ''}</h1>

        <ul>
          {
            messages.map(message => (
              <li key={`message-${message.id}`}>
                {message.text} {message.postedAt}
              </li>
            ))
          }
        </ul>

        <div>
          <textarea
            name="messageText"
            cols="30"
            rows="10"
            value={input}
            onChange={this.handleChange}
          />
          <button disabled={isInputEmpty} onClick={this.sendMessage}>
            送信
          </button>
        </div>
      </div>
    );
  }
}

export default Room;
