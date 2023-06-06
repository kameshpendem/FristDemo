import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';

// image components
import Call from '../../ImageComponents/Call';
import WhatsApp from '../../ImageComponents/WhatsApp';
import Close from '../../ImageComponents/Close';

// styles
import styles from './CallModalStyles';
import {getCountryCode} from '../../../../utils/CountryCode';

class CallModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callPhone = async () => {
    const {phoneNumber} = this.props;
    if (!phoneNumber) {
      return;
    }
    let url = '';
    const country_code = await getCountryCode();
    if (Platform.OS === 'android') {
      url = 'tel:' + country_code + phoneNumber;
    } else {
      url = 'telprompt:' + country_code + phoneNumber;
    }
    Linking.openURL(url);
  };

  textWhatsApp = async () => {
    const {phoneNumber} = this.props;
    if (!phoneNumber) {
      return;
    }
    const country_code = await getCountryCode();
    const url = 'whatsapp://send?phone=' + country_code + phoneNumber;
    Linking.openURL(url);
  };
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
              onPress={() => this.callPhone()}>
              <Call height={20} width={20} 
              testID="callImage"
              accessibilityLabel="callImage"/>
              <Text style={styles.callOptionText}
               testID="phoneCallText"
               accessibilityLabel="phoneCallText">
                {t('COMMON.PHONE_CALL')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.textWhatsApp()}>
              <WhatsApp height={20} width={20} 
               testID="whatsappImage"
               accessibilityLabel="whatsappImage"/>
              <Text style={styles.callOptionText}
               testID="whatsappText"
               accessibilityLabel="whatsappText">{t('COMMON.WHATSAPP')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(CallModal);
