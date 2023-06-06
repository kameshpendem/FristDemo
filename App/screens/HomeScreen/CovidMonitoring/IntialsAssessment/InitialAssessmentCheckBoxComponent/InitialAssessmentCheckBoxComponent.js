import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './CustomCheckBoxStyles';

// color codes

import {COLOR_CODES, DEFAULT_WHITE_COLOR} from '../../../../../themes/variable';
class InitialAssessmentCheckBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity {...this.props}
      testID={this.props.text+"touch"}
            accessibilityLabel={this.props.text+"touch"}>
        <View style={[styles.wrapper, {backgroundColor: this.props.color}]}>
          <Text
            style={[
              styles.fontSize10,
              {
                color:
                  this.props.color === COLOR_CODES.SEVERE ||
                  this.props.color === COLOR_CODES.NO ||
                  this.props.color === COLOR_CODES.MODERATE_YELLOW ||
                  this.props.color === COLOR_CODES.GREY ||
                  this.props.color === COLOR_CODES.ORANGE
                    ? DEFAULT_WHITE_COLOR
                    : COLOR_CODES.BLACK,
              },
            ]}
            testID={this.props.text+"text"}
            accessibilityLabel={this.props.text+"text"}>
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTranslation()(InitialAssessmentCheckBoxComponent);
