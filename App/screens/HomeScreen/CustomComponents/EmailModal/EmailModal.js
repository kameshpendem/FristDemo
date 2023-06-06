import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';

// image components
import Call from '../../ImageComponents/Call';
import Close from '../../ImageComponents/Close';
import Gmail from '../../../../assets/images/gmail.png';

// styles
import styles from './EmailModalStyles';
import i18n from '../../../../../i18n';

class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendEmail() {
    const {email} = this.props;
    if (!email) {
      return;
    }
    let url = 'mailto:' + email;
    Linking.openURL(url);
  }

  closeModal = () => {
    const {renderCallOptions} = this.props;
    if (typeof renderCallOptions === 'function') {
      renderCallOptions();
    }
    return;
  };

  render() {
    const {modal, t} = this.props;
    return (
      <Modal
        isVisible={modal}
        backdropOpacity={0.5}
        style={styles.modalPaddingStyles}>
        <View style={[styles.callModal]}>
          <View style={styles.callModalHeader}>
            <Text style={styles.selectBelowOptionText}
            testID="selectBelowOptionsText"
            accessibilityLabel="selectBelowOptionsText">
              {t('COMMON.SELECT_BELOW_OPTIONS')}
            </Text>
            <TouchableOpacity
              style={styles.closeOption}
              onPress={() => this.closeModal()}>
              <Close height={20} width={20} 
              testID="closeIcon"
              accessibilityLabel="closeIcon"/>
            </TouchableOpacity>
          </View>
          <View style={styles.callModalContent}>
            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.sendEmail()}>
              <Image source={Gmail} style={{height: 20, width: 20}} 
              testID="gmailImage"
              accessibilityLabel="gmailImage"/>
              <Text style={styles.callOptionText}
              testID="gmailText" accessibilityLabel="gmailText">{i18n.t('HISTORY.GMAIL')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(EmailModal);
