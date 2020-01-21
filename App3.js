import React, {Component} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Icon, Text, Card} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from './components/actionButton';
import CommonInput from './components/commonInput';
import MsgButton from './components/msgButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4F80E1',
    paddingTop: 20,
    paddingBottom: 5,
    paddingLeft: 5,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttons: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgb(134, 147, 158)',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default class HelloWorldApp extends Component {
  constructor(props) {
    super(props);
    this.inputChangeHandle = this.inputChangeHandle.bind(this);
    this.receiveMsgHandle = this.receiveMsgHandle.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.clearLogs = this.clearLogs.bind(this);
    this.socketHandle = this.socketHandle.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.addLog = this.addLog.bind(this);

    this.ws = null;

    this.state = {
      token: '',
      roomID: '',
      message: '',
      logs: '',
      connectBtnDisabled: true,
      disconnectBtnDisabled: true,
      sendBtnDisabled: true,
      connectIsLoading: false,
      disconnectIsLoading: false,
    };

    this.getData = this.getData.bind(this);
    this.setData = this.setData.bind(this);
  }
  async getData(key) {
    return await AsyncStorage.getItem(key);
  }

  async setData(key, value) {
    await AsyncStorage.setItem(key, value);
  }

  componentDidMount() {
    this.getData('wsToken').then(result => {
      if (result) this.inputChangeHandle(result, 'Token');
    });

    this.getData('wsRoomID').then(result => {
      if (result) this.inputChangeHandle(result, 'RoomID');
    });
  }

  buttonsStatus() {
    if (
      this.state.disconnectBtnDisabled &&
      this.state.token &&
      this.state.roomID
    ) {
      this.setState({connectBtnDisabled: false});
    } else {
      this.setState({connectBtnDisabled: true});
    }
  }

  inputChangeHandle(value, label) {
    if (label.includes('Token')) {
      this.setState({token: value}, () => {
        this.buttonsStatus();
        this.setData('wsToken', this.state.token);
      });
    } else if (label.includes('RoomID')) {
      this.setState({roomID: value}, () => {
        this.buttonsStatus();
        this.setData('wsRoomID', this.state.roomID);
      });
    } else if (label.includes('Message')) {
      this.setState({
        message: value,
        sendBtnDisabled: !(value && !this.state.disconnectBtnDisabled),
      });
    }
  }

  receiveMsgHandle(message) {
    this.inputChangeHandle(message, 'Message');
  }

  socketHandle() {
    this.ws.onopen = () => {
      this.sendMsg(`I'm coming!`);
      this.setState({
        connectBtnDisabled: true,
        disconnectBtnDisabled: false,
        sendBtnDisabled: false,
        connectIsLoading: false,
      });
    };
    this.ws.onclose = () => {
      this.addLog('DISCONNECTED');
      this.setState({
        connectBtnDisabled: false,
        disconnectBtnDisabled: true,
        sendBtnDisabled: true,
        disconnectIsLoading: false,
      });
    };
    this.ws.onmessage = event => {
      this.addLog('Received: ' + event.data);
    };
    this.ws.onerror = event => {
      this.addLog('Error: ' + event.data);
    };
  }
  connect() {
    this.setState({
      connectIsLoading: true,
    });
    this.ws = new WebSocket(
      `wss://connect.websocket.in/v2/${this.state.roomID}?token=${this.state.token}`,
    );
    this.socketHandle();
  }

  disconnect() {
    this.setState({
      disconnectIsLoading: true,
    });
    this.ws.close();
  }

  sendMsg(msg) {
    const txt = msg ? msg : this.state.message;
    if (txt.trim()) {
      this.ws.send(txt);
      this.addLog(`Emitted: ${txt}`);
    }
  }

  addLog(txt) {
    this.setState({
      logs: `${
        this.state.logs ? `${this.state.logs}\r\n> ${txt}` : `> ${txt}`
      }`,
    });
  }

  clearLogs() {
    this.setState({
      logs: '> Console cleared',
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentView}>
          <Icon
            color="white"
            name="car"
            type="font-awesome"
            size={30}
            containerStyle={{marginLeft: 5}}
          />
          <Text style={styles.heading}>WebSocket Test</Text>
        </View>
        <View>
          <CommonInput
            label="Token:"
            placeholder="Input token code"
            value={this.state.token}
            onInputChange={this.inputChangeHandle}></CommonInput>
          <CommonInput
            label="RoomID:"
            placeholder="(1-1000)"
            keyboardType="number-pad"
            value={this.state.roomID}
            onInputChange={this.inputChangeHandle}></CommonInput>
        </View>
        <View style={styles.buttonsContainer}>
          <ActionButton
            title="Connect"
            buttonStyle={styles.buttons}
            type="outline"
            disabled={this.state.connectBtnDisabled}
            loading={this.state.connectIsLoading}
            action={this.connect}></ActionButton>
          <ActionButton
            title="Disconnect"
            buttonStyle={styles.buttons}
            type="outline"
            disabled={this.state.disconnectBtnDisabled}
            loading={this.state.disconnectIsLoading}
            action={this.disconnect}></ActionButton>
        </View>
        <Text style={styles.label}>Quick Msg:</Text>
        <View style={styles.buttonsContainer}>
          <MsgButton
            title="Are you online"
            buttonStyle={{...styles.buttons, backgroundColor: '#3273dc'}}
            receiveMsg={this.receiveMsgHandle}></MsgButton>
          <MsgButton
            title="Please open url"
            buttonStyle={{...styles.buttons, backgroundColor: '#3298dc'}}
            receiveMsg={this.receiveMsgHandle}></MsgButton>
          <MsgButton
            title="Please get page info"
            buttonStyle={{...styles.buttons, backgroundColor: '#48c774'}}
            receiveMsg={this.receiveMsgHandle}></MsgButton>
        </View>
        <View style={styles.buttonsContainer}>
          <CommonInput
            label="Message:"
            placeholder="Type your message"
            value={this.state.message}
            onInputChange={this.inputChangeHandle}></CommonInput>
          <ActionButton
            title="Send"
            buttonStyle={{...styles.buttons, backgroundColor: '#00d1b2'}}
            disabled={this.state.sendBtnDisabled}
            disabledStyle={{backgroundColor: '#00d1b2', opacity: 0.5}}
            disabledTitleStyle={{color: '#fff'}}
            action={this.sendMsg}></ActionButton>
        </View>
        <View>
          <Card
            title="Log:"
            titleStyle={{alignSelf: 'baseline'}}
            containerStyle={{margin: 10}}>
            <Text style={{marginBottom: 10}}>{this.state.logs}</Text>
          </Card>
          <ActionButton
            title="Clear log"
            buttonStyle={{...styles.buttons, alignSelf: 'baseline'}}
            action={this.clearLogs}></ActionButton>
        </View>
      </ScrollView>
    );
  }
}
