import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';
import {Button, Icon, Item, Input, Toast, CheckBox} from 'native-base';
import {Portal, Modal} from 'react-native-paper';
import {savePatientConsent} from '../../../redux/actions/covidmonitoring_action';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import i18n from '../../../../i18n';

class PatientConsentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doctor_name: '',
      name: '',
      belongs_to: '',
      address: '',
      signature: '',
      checked: false,
      date: new Date(),
      show: false,
      mode: 'date',
      saving: false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.setState({
      name: this.props.patient.patient_name,
      signature: this.props.patient.patient_name,
    });
  };

  onChangeText(text, field) {
    this.setState({[field]: text});
  }

  save = async () => {
    const {name, belongs_to, address, signature, checked} = this.state;
    const {t} = this.props;

    if (!name || !belongs_to || !address || !signature || !checked) {
      Toast.show({
        text: t('MESSAGES.FILL_THE_CONSENT'),
        type: 'warning',
        duration: 5000,
      });
      return;
    }
    const role = await AsyncStorage.getItem('role');
    const payload = {
      token: this.props.token,
      id: this.props.doctor_id,
      doctor_name: this.props.doctor_name,
      hlp_id: this.props.patient.hlpid,
      enc_id: this.props.patient.enc_id,
      name,
      belongs_to,
      address,
      signature,
      doctor_flag: '1',
      role: role,
    };
    await this.props.savePatientConsent(payload);

    Toast.show({
      text: this.props.savePatientConsentData.message,
      type: 'success',
      duration: 5000,
    });

    this.props.onDismiss(true);
  };

  renderHeader() {
    return (
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderLabel}>{this.props.title}</Text>
        <Icon
          name="close"
          type="MaterialCommunityIcons"
          onPress={() => this.props.onDismiss(false)}
        />
      </View>
    );
  }

  renderContent() {
    return (
      <View>
        <View style={styles.consentFields}>
          <Text
          testID="iText"
          accessibilityLabel="iText">{'I'}</Text>
          <Item style={styles.consentInputField}>
            <Input
            testID="nameInput"
            accessibilityLabel="nameInput"
              value={this.state.name}
              onChangeText={(text) => this.onChangeText(text, 'name')}
            />
          </Item>
        </View>
        <View style={styles.consentFields}>
          <Text
          testID="swOfText"
          accessibilityText="swOfText">{'S/W of'}</Text>
          <Item style={styles.consentInputField}>
            <Input
            testID="swOfInput"
            accessibilityLabel="swOfInput"
              value={this.state.belongs_to}
              onChangeText={(text) => this.onChangeText(text, 'belongs_to')}
            />
          </Item>
        </View>
        <View style={styles.consentFields}>
          <Text
          testID="residentOfText"
          accessibilityLabel="residentOfText">{i18n.t("COMMON.RESIDENT_OF")}</Text>
          <Item style={styles.consentInputField}>
            <Input
             testID="residentOfTextInput"
             accessibilityLabel="residentOfTextInput"
              value={this.state.address}
              onChangeText={(text) => this.onChangeText(text, 'address')}
            />
          </Item>
        </View>
        <View style={styles.consentFields}>
          <Text
          testID="beingDiagnosiedText"
          accessibilityLabel="beingDiagnosiedText">
            {i18n.t("COMMON.BEING_DIAGNOSIED")}
          </Text>
        </View>
        <View style={styles.consentFields}>
          <Text
          testID="signatureText"
          accessibilityLabel="signatureText">{i18n.t("PROFILE.SIGNATURE")}</Text>
          <Item style={styles.consentInputField}>
            <Input
            testID="signatureTextInput"
            accessibilityLabel="signatureTextInput"
              value={this.state.signature}
              onChangeText={(text) => this.onChangeText(text, 'signature')}
            />
          </Item>
        </View>
        <View style={[styles.consentFields, styles.consentCheckView]}>
          <View>
            <CheckBox
              style={{ marginRight: 20}}
              checked={this.state.checked ? true : false}
              onPress={() =>
                this.setState((prevState) => ({
                  checked: !prevState.checked,
                }))
              }
            />
          </View>
          <View>
            <Text
            testID={"givenText"+this.props.patient.patient_name}
            accessibilityLabel={"givenText"+this.props.patient.patient_name}>
              {i18n.t("COMMON.CONCENT_GIVEN")} {this.props.doctor_name} {i18n.t("COMMON.BEHALF_OF")} {this.props.patient.patient_name}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderFooter() {
    const {t} = this.props;
    return (
      <View style={styles.modalActions}>
        <Button
        testID="cancelButton"
        accessibilityLabel="cancelButton"
          light
          style={styles.modalActionCancelButton}
          onPress={() => this.props.onDismiss(false)}
          disabled={this.state.saving}>
          <Text
          testID="cancelText"
          accessibilityLabel="cancelText">{t('COMMON.CANCEL')}</Text>
        </Button>
        <Button
        testID="saveButton"
        accessibilityLabel="saveButton"
          light
          style={styles.modalActionSaveButton}
          onPress={this.save}
          disabled={!this.state.checked}>
          {this.state.saving && (
            <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
          )}
          {!this.state.saving && <Text
          testID="saveText"
          accessibilityLabel="saveText">{t('COMMON.SAVE')}</Text>}
        </Button>
      </View>
    );
  }

  render() {
    return (
      <Portal>
        <Modal
          visible={this.props.visible}
          dismissable={false}
          onDismiss={() => this.props.onDismiss(false)}
          contentContainerStyle={styles.modalContainerStyle}>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFooter()}
        </Modal>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    margin: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  consentInputField: {
    flex: 6,
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalActionCancelButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginRight: 10,
    padding: 10,
  },
  modalActionSaveButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 10,
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    marginLeft: 0,
  },
  dateIcon: {
    fontSize: 18,
    marginLeft: 5,
  },
  consentFields: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  consentCheckView: {
    flexWrap: 'nowrap',    
    marginTop: 10,
    paddingRight: 30    
  }
});

const mapStateToProps = (state) => {
  return {
    savePatientConsentData: state.savePatientConsentData.response,
  };
};

export default withTranslation()(
  connect(mapStateToProps, {
    savePatientConsent,
  })(PatientConsentModal),
);
