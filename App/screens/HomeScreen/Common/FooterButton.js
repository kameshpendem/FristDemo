import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Footer, Button} from 'native-base';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../../../themes/variable';
import {theme} from '../../../themes/Theme';

class FooterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {onPress, label} = this.props;
    return (
      <Footer style={styles.footerSection}>
        <Button style={styles.footerButtonStyles} onPress={() => onPress()}
        testID={label+"button"} accessibilityLabel={label+"button"}>
          <Text style={styles.footerButtonText}
          testID={label+"text"} accessibilityLabel={label+"text"}>{label}</Text>
        </Button>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
  footerSection: {
    height: 80,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  footerButtonStyles: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  footerButtonText: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fontFamily.primarySemiBold,
    textAlign: 'center',
    color: DEFAULT_WHITE_COLOR,
  },
});

export default FooterButton;
