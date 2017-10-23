```diff
diff -rf 5-use-firebase/src/App.css 6-material-ui/src/App.css
a0
html {
  height: 100%;
}

body {
  height: 100%;
}

.
diff -rf 5-use-firebase/src/App.js 6-material-ui/src/App.js
a3
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
.
c12 13
    authStateChecked: false,
    user: null,
.
d17 23
d25
d31
d41
c46 56
      <MuiThemeProvider>
        <HashRouter>
          <div>
            <Switch>
              <UserOnlyRoute path="/" exact component={RoomList} />
              <UserOnlyRoute path="/room/:id" component={Room} />
              <Route path="/login" component={Login} />
              <Redirect to="/" />
            </Switch>
          </div>
        </HashRouter>
      </MuiThemeProvider>
.
diff -rf 5-use-firebase/src/UserOnlyRoute.js 6-material-ui/src/UserOnlyRoute.js
d6 11
d13
d15
c38
  ]).isRequired,
.
diff -rf 5-use-firebase/src/index.js 6-material-ui/src/index.js
d9 10
diff -rf 5-use-firebase/src/pages/Login.js 6-material-ui/src/pages/Login.js
a2
import RaisedButton from 'material-ui/RaisedButton';
.
d5 7
d23
d29
c35 37
      .then(() => {
.
d41
c53
        <RaisedButton
          label="ログイン"
          fullWidth={true}
          onClick={this.handleClick}
        />
.
Only in 6-material-ui/src/pages: Room.css
diff -rf 5-use-firebase/src/pages/Room.js 6-material-ui/src/pages/Room.js
a2
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
.
a4
import Loading from '../Loading';
import './Room.css';
.
d25
a29
    users: {
      [this.props.user.uid]: this.props.user,
    },
.
c65
            this.setState({ messages }, () => {
              this.scrollToBottom();
            });
.
a83
  scrollToBottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

.
c108
        this.setState({ input: '', sending: false }, () => {
          this.scrollToBottom();
        });
.
a115
  backToRoomList = () => {
    this.props.history.goBack();
  };

.
c122
        <AppBar
          className="Room__header"
          title={name || ''}
          iconElementLeft={
            <IconButton onClick={this.backToRoomList}>
              <NavigationChevronLeft/>
            </IconButton>
          }
        />
.
c124
        <div className="Room__body">
.
c127 133
              <Card key={`message-${message.id}`}>
                <CardHeader
                  title={message.user.displayName}
                  subtitle={message.postedAt}
                  avatar={message.user.photoURL}
                />
                <CardText>{message.text}</CardText>
              </Card>
.
c136
            <Loading />
.
c138
        </div>
.
c140 141
        <Paper className="Room__footer" zDepth={3}>
          <TextField
            className="Room__textField"
.
d143 144
c149 152
          <RaisedButton
            label="送信"
            primary={true}
            disabled={sending || isInputEmpty}
            onClick={this.sendMessage}
          />
        </Paper>
.
diff -rf 5-use-firebase/src/pages/RoomList.js 6-material-ui/src/pages/RoomList.js
a2
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
.
a4
import Loading from '../Loading';
.
d21
d49 52
c59
      contents = <Loading />;
.
c61
      contents = (
        <List>
          <ListItem primaryText="部屋がありません" />
        </List>
      );
.
c64
        <List>
.
c66 69
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
.
c71
        </List>
.
c77
        <AppBar title="ルーム一覧" iconClassNameLeft={null} />
.
c79 81
        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px' }}
          onClick={this.createRoom}
        >
          <ContentAdd />
        </FloatingActionButton>
.
c83
        <Divider />
.
```
