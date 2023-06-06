import React, {Component} from 'react';
import {View, Text} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

// styles
import styles from './RequestsStyles';

class DeclineCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = () => {
    const {action} = this.props;
    if (typeof action === 'function') {
      action();
    }
    return;
  };

  render() {
    const {value, text} = this.props;
    return (
      <View style={styles.checkBoxMainView}>
        <CheckBox
          value={value ? true : false}
          style={styles.checkBoxMargin}
          onValueChange={() => this.handleChange()}
        />
        <Text style={styles.checkBoxText}>{text}</Text>
      </View>
    );
  }
}

export default DeclineCheckBox;
