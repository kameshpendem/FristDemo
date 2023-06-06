import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';

// image components
import Close from '../../ImageComponents/Close';
import CallUs from '../../../../assets/images/mobile.svg';
import EmailUs from '../../../../assets/images/practice_email.svg';

// styles
import styles from './RequestCallOptionsStyles';
import CallModal from '../CallModal/CallModal';
import EmailModal from '../EmailModal/EmailModal';

class RequestCallOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true,
      callModal: false,
      emailModal: false,
    };
  }

  closeModal = () => {
    const {closeAction} = this.props;
    if (typeof closeAction === 'function') {
      closeAction();
    }
    this.setState({
      modal: false,
    });
    return;
  };

  renderCallModal = () => {
    this.setState((prevState) => ({
      callModal: !prevState.callModal,
    }));
  };

  renderEmailModal = () => {
    this.setState((prevState) => ({
      emailModal: !prevState.emailModal,
    }));
  };

  render() {
    const {
      callText,
      callSubText,
      emailText,
      emailSubText,
      phoneNumber,
      email,
      t,
    } = this.props;
    return (
      <View>
        <Modal
          isVisible={this.state.modal}
          backdropOpacity={0.5}
          style={styles.modalPaddingStyles}>
          <View style={[styles.callModal]}>
            <View style={styles.callModalHeader}>
              <Text style={styles.selectBelowOptionText}>
                {t('COMMON.SELECT_BELOW_OPTIONS')}
              </Text>
              <TouchableOpacity
                style={styles.closeOption}
                onPress={() => this.closeModal()}>
                <Close height={15} width={15} />
              </TouchableOpacity>
            </View>
            <View style={styles.callModalContent}>
              <TouchableOpacity
                style={styles.callOption}
                onPress={() => this.renderCallModal()}>
                <CallUs height={20} width={20} />
                <View>
                  <Text style={styles.callOptionText}>{callText}</Text>
                  <Text style={styles.callOptionSubText}>{callSubText}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callOption}
                onPress={() => this.renderEmailModal()}>
                <EmailUs height={20} width={20} />
                <View>
                  <Text style={styles.callOptionText}>{emailText}</Text>
                  <Text style={styles.callOptionSubText}>{emailSubText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {this.state.callModal && (
          <CallModal
            modal={this.state.callModal}
            phoneNumber={phoneNumber}
            renderCallOptions={() => this.renderCallModal()}
          />
        )}

        {this.state.emailModal && (
          <EmailModal
            modal={this.state.emailModal}
            email={email}
            renderCallOptions={() => this.renderEmailModal()}
          />
        )}
      </View>
    );
  }
}

export default withTranslation()(RequestCallOptions);
