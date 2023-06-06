import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {View, Text} from 'react-native';

// styles
import styles from './HistoryCheckBoxSectionStyles';

class HistoryCheckBoxSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={[styles.temperatureInputFiledWrapper, styles.itemsCenter]}>
        <View
          style={[
            styles.inputSectionHeightAndWidth,
            styles.itemsCenter,
            styles.marginRight,
          ]}>
          <View
            style={[
              styles.inputFiledSection,
              {backgroundColor: `${this.props.color}`},
              styles.itemsCenter,
            ]}>
            <Text style={styles.input}
            testID={this.props.value+"text"}
            accessibilityLabel={this.props.value+"text"}>{this.props.value}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withTranslation()(HistoryCheckBoxSection);
