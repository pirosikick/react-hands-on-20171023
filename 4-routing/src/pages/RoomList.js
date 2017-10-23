import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RoomList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  };

  state = {
    rooms: [],
  };

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  createRoom = () => {
    const roomName = window.prompt('部屋名を入力してください');
    if (!roomName) {
      return;
    }

    const room = {
      id: Date.now(),
      name: roomName
    };
    this.setState({ rooms: this.state.rooms.concat(room) })
  };

  enterRoom = room => {
    // 部屋ページに遷移
    // 第2引数に遷移先に状態を渡すことが出来る
    this.props.history.push(`/room/${room.id}`, {
      name: room.name
    });
  };

  render() {
    const { rooms } = this.state;
    const isRoomsLoaded = Array.isArray(rooms);

    let contents;
    if (!isRoomsLoaded) {
      contents = <p>読み込み中</p>;
    } else if (!rooms.length) {
      contents = <p>部屋がありません</p>;
    } else {
      contents = (
        <ul>
          {rooms.map(room => (
            <li key={`room-${room.id}`}>
              {room.name}
              <button onClick={() => this.enterRoom(room)}>入室する</button>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        <h1>ルーム一覧</h1>

        <div>
          <button onClick={this.createRoom}>新しい部屋を作る</button>
        </div>

        <hr />

        {contents}
      </div>
    );
  }
}

export default RoomList;
