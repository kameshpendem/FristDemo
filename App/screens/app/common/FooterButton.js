import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';

class FooterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {onPress, label} = this.props;
    return (
      <View style={styles.addbottom}>
        <TouchableOpacity style={styles.generate} onPress={onPress}
        testID={label+"touch"} accessibilityLabel={label+"touch"}>
          <Text style={styles.generatetext} testID={label+"text"} accessibilityLabel={label+"text"}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addbottom: {
    bottom: Platform.OS === 'ios' ? 10 : 0,
    position: 'absolute',
    width: '100%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
    flex: 1,
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 12,
    borderRadius: 5,
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: 'center',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
  },
});

export default FooterButton;