import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Button} from 'native-base';

// styles
import styles from './RequestsStyles';

//images
import Accept from '../../../../assets/images/accept.svg';
import Decline from '../../../../assets/images/decline.svg';

class HospitalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  accept = () => {
    const {acceptAction} = this.props;
    if (typeof acceptAction === 'function') {
      acceptAction();
    }
    return;
  };

  decline = () => {
    const {declineActions} = this.props;
    if (typeof declineActions === 'function') {
      declineActions();
    }
    return;
  };

  render() {
    const {t} = this.props;
    return (
      <View style={styles.requestButtonsMainView}>
        <Button style={styles.acceptButtonStyles} onPress={() => this.accept()}>
          <Accept />
          <Text style={styles.acceptText}>
            {t('MY_PRACTICES.REQUESTS.ACCEPT')}
          </Text>
        </Button>
        {/* COMMENTED DECLINED BUTTON IN NEW REQUESTS */}
        {/* <Button
          style={styles.declineButtonStyles}
          onPress={() => this.decline()}>
          <Decline />
          <Text style={styles.declineText}>
            {t('MY_PRACTICES.REQUESTS.DECLINE')}
          </Text>
        </Button> */}
      </View>
    );
  }
}

export default withTranslation()(HospitalActions);
