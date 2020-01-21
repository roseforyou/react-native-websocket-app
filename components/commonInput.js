import React from 'react';
import {Input} from 'react-native-elements';

class CommonInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange({nativeEvent: {eventCount, target, text}}) {
    this.props.onInputChange(text, this.props.label);
  }

  render() {
    return (
      <Input
        label={this.props.label || ''}
        placeholder={this.props.placeholder || ''}
        keyboardType={this.props.keyboardType || 'default'}
        disabled={this.props.disabled || false}
        value={this.props.value}
        onChange={this.inputChange}
      />
    );
  }
}

export default CommonInput;
