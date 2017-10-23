import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import 'firebase/firestore';
import * as firebase from 'firebase';
import Loading from '../Loading';

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

  render() {
    const { rooms } = this.state;
    const isRoomsLoaded = Array.isArray(rooms);

    let contents;
    if (!isRoomsLoaded) {
      contents = <Loading />;
    } else if (!rooms.length) {
      contents = (
        <List>
          <ListItem primaryText="部屋がありません" />
        </List>
      );
    } else {
      contents = (
        <List>
          {rooms.map(room => (
            <ListItem
              key={`room-${room.id}`}
              primaryText={room.name}
              rightIcon={
                <FontIcon className="material-icons">chevron_right</FontIcon>
              }
              onClick={() => {
                this.props.history.push(`/room/${room.id}`);
              }}
            />
          ))}
        </List>
      );
    }

    return (
      <div>
        <AppBar title="ルーム一覧" iconClassNameLeft={null} />

        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px' }}
          onClick={this.createRoom}
        >
          <ContentAdd />
        </FloatingActionButton>

        <Divider />

        {contents}
      </div>
    );
  }
}

export default RoomList;
