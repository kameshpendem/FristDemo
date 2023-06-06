import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles

import styles from './TextInputStyles';

class InitialAssessmentInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={[styles.flex, styles.contentCenter]}>
        <TextInput
          keyboardType={'numeric'}
          returnKeyType="done"
          style={[styles.textInputWrapper, {borderColor:`${this.props.borderColor}`}]}
          {...this.props}
        />
      </View>
    );
  }
}

export default withTranslation()(InitialAssessmentInputComponent);
