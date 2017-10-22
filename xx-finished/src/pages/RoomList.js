import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import 'firebase/firestore';
import * as firebase from 'firebase';

class RoomList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    })
  };

  state = {
    rooms: undefined,
  };

  componentDidMount() {

    const db = firebase.firestore();
    const roomsRef = db.collection('rooms');

    this.unsubscribe = roomsRef.onSnapshot(snapshot => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.setState({ rooms });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleClick = () => {
    const roomName = window.prompt('部屋名を入力してください');
    if (!roomName) {
      return;
    }

    const db = firebase.firestore();
    const room = { name: roomName };
    db.collection('rooms').add(room);
  };

  render() {
    const { rooms } = this.state;
    const isRoomsLoaded = Array.isArray(rooms);

    let contents;
    if (!isRoomsLoaded) {
      contents = <p>読み込み中...</p>;
    } else if (!rooms.length) {
      contents = <p>部屋がありません</p>;
    } else {
      contents = rooms.map(room => (
        <li key={`room-${room.id}`}>
          {room.name} <Link to={`/room/${room.id}`}>入室</Link>
        </li>
      ));
    }

    return (
      <div>
        <h1>ルーム一覧</h1>
        <button onClick={this.handleClick} disabled={!isRoomsLoaded}>
          部屋を追加する
        </button>

        {contents}
      </div>
    );
  }
}
RoomList.propTypes = {};

export default RoomList;
