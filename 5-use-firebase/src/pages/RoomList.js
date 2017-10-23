import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'firebase/firestore';
import * as firebase from 'firebase';

class RoomList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  };

  state = {
    rooms: undefined,
  };

  componentDidMount() {
    const db = firebase.firestore();
    const roomsRef = db.collection('rooms');

    // 部屋情報の変更を監視
    this.unsubscribe = roomsRef.onSnapshot(snapshot => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.setState({ rooms });
    });
  }

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

    const db = firebase.firestore();
    const room = { name: roomName };
    db.collection('rooms').add(room);
  };

  enterRoom = roomId => {
    this.props.history.push(`/room/${roomId}`);
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
              <button onClick={() => this.enterRoom(room.id)}>入室する</button>
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
