import React from 'react';
import {Button} from 'react-native-elements';

class MsgButton extends React.Component {
  constructor(props) {
    super(props);
    this.setMessage = this.setMessage.bind(this);
  }

  setMessage() {
    this.props.receiveMsg(this.props.title);
  }

  render() {
    return (
      <Button
        title={this.props.title}
        buttonStyle={this.props.buttonStyle || {}}
        onPress={this.setMessage}
      />
    );
  }
}

export default MsgButton;
