import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Button} from 'native-base';
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modal';

// styles
import styles from './CallOptionsComponentStyles';

// theme variables
import {DEFAULT_LIGHT_GREY_COLOR} from '../../../../themes/variable';

// image components
import Call from '../../ImageComponents/Call';

// custom components
import CallModal from '../CallModal/CallModal';

class CallOptionsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  renderCallOptions = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  renderCallModal = () => {
    const {phoneNumber} = this.props;
    return (
      <CallModal
        phoneNumber={phoneNumber}
        modal={this.state.modal}
        renderCallOptions={() => this.renderCallOptions()}
      />
    );
  };

  render() {
    const {phoneNumber} = this.props;
    return (
      <View>
        {!!phoneNumber && (
          <Button
          testID="callButton"
          accessibilityLabel="callButton"
            rounded
            androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
            style={styles.callButtonStyles}
            onPress={() => this.renderCallOptions()}>
            <Call height={15} width={15} 
            testID="callImage"
            accessibilityLabel="callImage"/>
            <Text style={styles.numberStyles}
            testID={phoneNumber+"text"}
            accessibilityLabel={phoneNumber+"text"}>{phoneNumber}</Text>
          </Button>
        )}
        {this.state.modal && this.renderCallModal()}
      </View>
    );
  }
}

export default withTranslation()(CallOptionsComponent);
