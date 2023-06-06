import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Container, Footer, Toast, Button} from 'native-base';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

// Styles
import styles from './PracticeSettingsStyles';

// Images
import DownArrow from '../../../../assets/images/downarrow.svg';
import Close from '../../../../assets/images/close.svg';

// services
import {
  consultationFees,
  setConsultationFees,
} from '../../../../services/MyPracticeService';
import i18n from '../../../../../i18n';

class PracticeSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      modal: false,
      slot_time: '',
      branch_id: '',
      stand_alone: '',
      consultation_fees: {},
      editable: false,
    };
  }

  checkUserHasEditable = async (stand_alone) => {
    let flag = true;
    const role = await AsyncStorage.getItem('role');

    if (
      stand_alone ||
      role.toLowerCase() === 'practice' ||
      role.toLowerCase() === 'execution team'
    ) {
      flag = true;
    }
    return flag;
  };

  componentDidMount = async () => {
    const {branch_id, slot_timing, stand_alone, work_timing_id} =
      this.props?.navigation?.state?.params;
    const editable = await this.checkUserHasEditable(stand_alone);

    this.setState(
      {
        slot_time: slot_timing,
        branch_id: branch_id,
        stand_alone: stand_alone,
        work_timing_id: work_timing_id,
        editable: editable,
      },
      () => this.init(),
    );
  };

  init = async () => {
    try {
      const branchId = this.state.branch_id;
      const doctorId = await AsyncStorage.getItem('doctorid');
      const response = await consultationFees(doctorId, branchId);
      if (response && response.data) {
        this.setState({
          consultation_fees: response.data,
        });
      }
    } catch (error) {
      Toast.show({
        text:
          error?.message || t('MY_PRACTICES.ERRORS.CONSULTATION_FESS_ERROR'),
        type: 'danger',
        duration: 5000,
      });
      throw error;
    }
  };

  updateConsultationFees = async () => {
    try {
      const {t} = this.props;
      const {consultation_fees} = this.state;
      const branchId = this.state.branch_id;
      const doctorId = await AsyncStorage.getItem('doctorid');
      const price_list_id = consultation_fees.pricelist_id;
      const payload = {
        ...consultation_fees,
        slot_timing: this.state.slot_time,
        work_timing_id: this.state.work_timing_id,
      };
      const response = await setConsultationFees(
        doctorId,
        branchId,
        price_list_id,
        payload,
      );

      if (response) {
        Toast.show({
          text: t('MY_PRACTICES.ERRORS.CONSULTATION_FESS_SUCCESS_MESSAGE'),
          type: 'success',
          duration: 5000,
        });
      }
    } catch (error) {
      Toast.show({
        text:
          error?.message ||
          t('MY_PRACTICES.ERRORS.CONSULTATION_FESS_UPDATE_ERROR'),
        type: 'danger',
        duration: 5000,
      });
    }
  };

  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  handleConsultationFees = async (text, edit_key) => {
    const {consultation_fees} = this.state;

    consultation_fees[edit_key] = text;
    this.setState({
      consultation_fees: consultation_fees,
    });
  };

  renderFeeSection = (headingText, defaultValue, edit_key,testID) => {
    const {t} = this.props;
    return (
      <View style={styles.inputMainView}>
        <Text style={styles.inputLabel}
        testID={testID}
        accessibilityLabel={testID}>{headingText}</Text>
        <View style={styles.textAndInputSection}>
          <Text style={styles.rsText}
          testID="rsText"
          accessibilityLabel="rsText">
            {t('MY_PRACTICES.PRACTICE_SETTINGS.RS.')}
          </Text>
          <TextInput
          testID={testID}
          accessibilityLabel={testID}
            keyboardType={'numeric'}
            returnKeyType="done"
            defaultValue={defaultValue}
            editable={this.state.editable}
            style={styles.textInputStyles}
            onChangeText={(text) => this.handleConsultationFees(text, edit_key)}
          />
        </View>
        <View style={styles.underLineStyles}></View>
      </View>
    );
  };

  enableSlotTimeDropdown = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  updateTimeSlot = (value) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
      slot_time: value,
    }));
  };

  renderEachTimeSlot = (text, value,testID) => {
    return (
      <TouchableOpacity
        style={styles.slotTimeTouchableView}
        onPress={() => this.updateTimeSlot(value)}>
        <Text testID={testID} accessibilityLabel={testID}>{text}</Text>
      </TouchableOpacity>
    );
  };
  renderTimeSlotModal = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.modal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.enableSlotTimeDropdown()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          {/* Hospital header and close Icon start */}
          <View style={styles.headerView}>
            <View style={[styles.flexDirectionRow, styles.hospitalViewMargin]}>
              <Text style={styles.hospitalName}
              testID="selectSlotTimeText"
              accessibilityLabel="selectSlotTimeText">
                {t(
                  'MY_PRACTICES.PRACTICE_SETTINGS.SELECT_SLOT_FOR_APPOINTMENT',
                )}
              </Text>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
              testID="closeTouch"
              accessibilityLabel="closeTouch"
                style={styles.touchableArea}
                onPress={() => this.enableSlotTimeDropdown()}>
                <Close height={15} width={15} style={styles.closeImage} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.5_MINS'), '5',"fiveMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.10_MINS'), '10',"tenMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.15_MINS'), '15',"fifteenMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.20_MINS'), '20',"twentyMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.25_MINS'), '25',"twentyfiveMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.30_MINS'), '30',"thirtyMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.35_MINS'), '35',"thirtyfiveMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.40_MINS'), '40',"fourtyMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.45_MINS'), '45',"fourtyfiveMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.50_MINS'), '50',"fiftyMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.55_MINS'), '55',"fiftyFiveMinsText")}
            {this.renderEachTimeSlot(t('MY_PRACTICES.SLOT_TIMINGS.60_MINS'), '60',"sixtyMinsText")}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  openTermsAndServices = () => {
    const {t} = this.props;
    try {
      Linking.openURL('https://www.healpha.com/terms-of-service/');
    } catch (error) {
      Toast.show({
        text: t('LOGIN.TERMS_OF_SERVICE_OPEN_ERROR'),
        type: 'warning',
        duration: 3000,
        position: 'bottom',
      });
    }
  };

  render() {
    const {t} = this.props;
    const {consultation_fees} = this.state;
    return (
      <SafeAreaView style={styles.flex}>
        <Container style={styles.wrapper}>
          <ScrollView>
            <View style={[styles.screenPadding, styles.feesMainView]}>
              <Text style={styles.consultationFeeText}
              testID="consultationfeesText"
              accessibilityLabel="consultationfeesText">
                {t('MY_PRACTICES.PRACTICE_SETTINGS.CONSULTATION_FEES')}
              </Text>
              {/* fee input sections */}
              {this.renderFeeSection(
                t('MY_PRACTICES.PRACTICE_SETTINGS.GENERAL'),
                consultation_fees.general_price,
                'general_price',
                "generalText"
              )}
              {this.renderFeeSection(
                t('MY_PRACTICES.PRACTICE_SETTINGS.EMERGENCY'),
                consultation_fees.emergency_price,
                'emergency_price',
                "emergencyTxt"
              )}
              {this.renderFeeSection(
                t('MY_PRACTICES.PRACTICE_SETTINGS.REVIEW'),
                consultation_fees.review,
                'review',
                "reviewTExt"
              )}
              {this.renderFeeSection(t('MY_PRACTICES.PRACTICE_SETTINGS.COVID'), consultation_fees.covid, 'covid',"covidText")}
              {this.renderFeeSection(
                t('MY_PRACTICES.PRACTICE_SETTINGS.HOMECARE'),
                consultation_fees.homecare,
                'homecare',
                "homeCareText"
              )}
              {this.renderFeeSection(
                t('MY_PRACTICES.PRACTICE_SETTINGS.TELEMEDICINE'),
                consultation_fees.telemedicine,
                'telemedicine',
                "telemedicineText"
              )}
            </View>
            <View style={styles.underLineStyles} />
            <View style={[styles.slotTimeMainView, styles.screenPadding]}>
              <Text style={styles.termsText}
              testID="slotTimeText"
              accessibilityLabel="slotTimeText">
                {t('MY_PRACTICES.PRACTICE_SETTINGS.SLOT_TIME')}
              </Text>
              <Text style={[styles.inputLabel, styles.labelPadding]}
              testID="selectSlotForAppointmentText"
              accessibilityLabel="selectSlotForAppointmentText">
                {t(
                  'MY_PRACTICES.PRACTICE_SETTINGS.SELECT_SLOT_FOR_APPOINTMENT',
                )}
              </Text>
              <View style={styles.dropdownMainView}>
                <View style={styles.flex}>
                  <Text style={styles.dropdownText}
                  testID={this.state.slot_time+"text"}
                  accessibilityLabel={this.state.slot_time+"text"}>
                    {this.state.slot_time
                      ? `${this.state.slot_time}`
                      : 'Select'}
                  </Text>
                </View>
                <TouchableOpacity
                 testID="downArrowTouch"
                 accessibilityLabel="downArrowTouch"
                  onPress={() => this.enableSlotTimeDropdown()}
                  disabled={this.state.editable === false ? true : false}>
                  <DownArrow 
                  testID="downArrow"
                  accessibilityLabel="downArrow"/>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.underLineStyles} /> */}
              {/* <Text style={[styles.termsText, styles.marginTop10]}>
                {t('MY_PRACTICES.PRACTICE_SETTINGS.TERMS')}
              </Text>
              <Text
                style={styles.linkText}
                onPress={() => this.openTermsAndServices()}>
                {t('MY_PRACTICES.PRACTICE_SETTINGS.HE_ALPHA_TERMS')}
              </Text> */}
            </View>
          </ScrollView>
        </Container>

        {/* footer section */}
        {this.state.editable && (
          <Footer
            style={[
              styles.footerStyles,
              styles.screenPadding,
              styles.footerBorder,
            ]}>
            <Button
             testID="updateButton"
             accessibilityLabel="updateButton"
              style={styles.button}
              onPress={() => this.updateConsultationFees()}>
              <Text style={styles.buttonText}
              testID="updateText"
              accessibilityLabel="updateText">
                {t('MY_PRACTICES.PRACTICE_SETTINGS.UPDATE')}
              </Text>
            </Button>
          </Footer>
        )}
        {this.state.modal && this.renderTimeSlotModal()}
      </SafeAreaView>
    );
  }
}

export default withTranslation()(PracticeSettings);
