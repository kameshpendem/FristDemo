import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';

import styles from './PracticesStyles';

class PracticeActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleAction = () => {
    const {practiceAction} = this.props;
    if (typeof practiceAction === 'function') {
      practiceAction();
    }
  };

  render() {
    const {headerText, subText, touchableFlag, practiceIcon} = this.props;
    return (
      <View
        style={[
          styles.flexDirectionRow,
          styles.actionViewMarginBottom,
          touchableFlag ? {} : styles.disableOpacity,
        ]}>
        <View style={styles.actionImageView} testID={practiceIcon+"image"} accessibilityLabel={practiceIcon+"image"}>{practiceIcon}</View>
        <View style={styles.flex}>
          <TouchableOpacity
            disabled={touchableFlag ? false : true}
            onPress={() => this.handleAction()}>
            <Text style={styles.actionHeaderText} testID={headerText+"text"} accessibilityLabel={headerText+"text"}>{headerText}</Text>
            <Text style={styles.actionHeaderSubText} testID={subText+"text"} accessibilityLabel={subText+"text"}>{subText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withTranslation()(PracticeActions);
