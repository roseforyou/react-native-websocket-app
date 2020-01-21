import React from 'react';
import {Button} from 'react-native-elements';

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.clickEvent = this.clickEvent.bind(this);
  }

  clickEvent() {
    if (!this.props.disabled) {
      this.props.action();
    }
  }

  render() {
    this.loading = !!this.props.loading;
    this.disabled = !!this.props.disabled || this.loading;

    return (
      <Button
        title={this.props.title}
        buttonStyle={this.props.buttonStyle}
        type={this.props.type}
        disabled={this.disabled}
        disabledStyle={this.props.disabledStyle || {}}
        disabledTitleStyle={this.props.disabledTitleStyle || {}}
        loading={this.loading}
        onPress={this.clickEvent}
      />
    );
  }
}
export default ActionButton;
