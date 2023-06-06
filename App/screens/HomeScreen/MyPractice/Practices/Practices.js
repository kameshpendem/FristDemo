import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import {Container, Button, Toast} from 'native-base';
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

// images
import Patients from '../../../../assets/images/patients.png';
import Menu from '../../../../assets/images/kebab_menu.svg';
import Close from '../../../../assets/images/close.svg';
import EditTimings from '../../../../assets/images/edit_doctor_timings.svg';
import ViewPracticeSettings from '../../../../assets/images/view_practice_settings.svg';
import DeactivateAndActivate from '../../../../assets/images/deactivate_activate.svg';
import CallUs from '../../../../assets/images/mobile.svg';
import EmailUs from '../../../../assets/images/practice_email.svg';
import CrossRed from '../../../../assets/images/cross_red.svg';

// components
import PracticeActions from './PracticeActions';
import CallModal from '../../CustomComponents/CallModal/CallModal';

// dummy json
import {dummyJson} from '../Constants';

// styles
import styles from './PracticesStyles';
import {DEFAULT_GREY_COLOR} from '../../../../themes/variable';
import EmailModal from '../../CustomComponents/EmailModal/EmailModal';
import {getApiUrl} from '../../../../config/Config';

// services

import {
  getDoctorApprovedPracticeList,
  getDoctorDeclinedList,
  acceptNewPractice,
  declineNewPractice,
} from '../../../../services/MyPracticeService';
import {nameConversion} from '../../../../utils/NameConversion';
import NavRoutes from '../../../../constants/NavRoutes';

class Practices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorData: dummyJson,
      selected_hospital: {},
      visible: false,
      practice_flag: true,
      deActiveModal: false,
      callModal: false,
      emailModal: false,
      deActivateConfirm: false,
      password: '',
      approved_practices: [],
      declined_practices: [],
      init: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.init();
    this.props.navigation.addListener('willFocus', this._handleStateChange);
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    this.init();
  };

  splitTime = (time) => {
    const splitTime = time.split('to');
    let stTime = '',
      endTime = '';
    if (splitTime[0]) {
      stTime = splitTime[0].trim();
      stTime = moment(stTime, 'H:mm')
        .format('LT')
        .replace(' ', '')
        .toLowerCase();
    }
    if (splitTime[1]) {
      endTime = splitTime[1].trim();
      endTime = moment(endTime, 'H:mm')
        .format('LT')
        .replace(' ', '')
        .toLowerCase();
    }
    return {
      start_time: stTime,
      end_time: endTime,
    };
  };

  isValidSequence = (data) => {
    let isValid = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i + 1] && data[i + 1].index - data[i].index !== 1) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  doctorWorkTimings = (data) => {
    const results = [];
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      const mapData = {
        0: {
          chk_key: 'mon_chk',
          time_key: 'monday_working_time',
          start_time: 'mon_start_time',
          end_time: 'mon_end_time',
          day: 'MON',
        },
        1: {
          chk_key: 'tue_chk',
          time_key: 'tuesday_working_time',
          start_time: 'tue_start_time',
          end_time: 'tue_end_time',
          day: 'TUE',
        },
        2: {
          chk_key: 'wed_chk',
          time_key: 'wednesday_working_time',
          start_time: 'wed_start_time',
          end_time: 'wed_end_time',
          day: 'WED',
        },
        3: {
          chk_key: 'thu_chk',
          time_key: 'thursday_working_time',
          start_time: 'thu_start_time',
          end_time: 'thu_end_time',
          day: 'THU',
        },
        4: {
          chk_key: 'fri_chk',
          time_key: 'friday_working_time',
          start_time: 'fri_start_time',
          end_time: 'fri_end_time',
          day: 'FRI',
        },
        5: {
          chk_key: 'sat_chk',
          time_key: 'saturday_working_time',
          start_time: 'sat_start_time',
          end_time: 'sat_end_time',
          day: 'SAT',
        },
        6: {
          chk_key: 'sun_chk',
          time_key: 'sunday_working_time',
          start_time: 'sun_start_time',
          end_time: 'sun_end_time',
          day: 'SUN',
        },
      };
      const workTimingData = {};
      for (let i = 0; i <= 6; i++) {
        if (data[mapData[i].start_time] && data[mapData[i].end_time]) {
          const workingTime = `${data[mapData[i].start_time]} to ${
            data[mapData[i].end_time]
          }`;
          const pushObj = {
            day: `${mapData[i].day}`,
            index: i,
          };
          if (workTimingData[workingTime]) {
            workTimingData[workingTime].push(pushObj);
          } else {
            workTimingData[workingTime] = [pushObj];
          }
        }
      }
      for (const workingTime in workTimingData) {
        if (
          workingTime &&
          workTimingData[workingTime] &&
          Array.isArray(workTimingData[workingTime]) &&
          workTimingData[workingTime].length > 0
        ) {
          const length = workTimingData[workingTime].length;
          const timeObj = this.splitTime(workingTime);
          const obj = {
            value: `${timeObj.start_time} - ${timeObj.end_time}`,
          };
          if (length > 2 && this.isValidSequence(workTimingData[workingTime])) {
            obj.label = `${workTimingData[workingTime][0].day} - ${
              workTimingData[workingTime][length - 1].day
            }`;
          } else {
            obj.label = workTimingData[workingTime]
              .map((item) => item.day)
              .join();
          }
          results.push(obj);
        }
      }
    }
    return results;
  };

  getApprovedPracticeList = async () => {
    const {t} = this.props;

    try {
      const doctorId = await AsyncStorage.getItem('doctorid');
      const doctorApprovedPractices = await getDoctorApprovedPracticeList(
        doctorId,
      );
      if (doctorApprovedPractices && doctorApprovedPractices?.data) {
        this.setState({
          approved_practices: doctorApprovedPractices.data,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.GET_APPROVED_PRACTICE_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    }
  };

  getDeclinedPracticeList = async () => {
    const {t} = this.props;
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');
      const doctorDeclinedPractices = await getDoctorDeclinedList(doctorId);
      if (doctorDeclinedPractices && doctorDeclinedPractices?.data) {
        this.setState({
          declined_practices: doctorDeclinedPractices.data,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.GET_DECLINED_PRACTICE_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    }
  };

  init = async () => {
    await this.getApprovedPracticeList();
    await this.getDeclinedPracticeList();
  };

  enableHospitalModal = (hospital, practice_flag) => {
    this.setState({
      selected_hospital: hospital,
      visible: true,
      practice_flag: practice_flag,
    });
  };

  renderPracticeImage = (element) => {
    const imageUrl = element.PRACTICE_IMAGE;

    const url = getApiUrl() + '/' + imageUrl.trim();

    return <Image source={{uri: url}} style={styles.imageStyles} />;
  };

  activatePractice = (element) => {
    this.setState(
      {
        selected_hospital: element,
      },
      () => this.deActivatePractice(),
    );
  };

  renderPracticeWorkTimings = (object) => {
    const result = this.doctorWorkTimings(object);
    return result.map((element) => (
      <Text>
        {element.label} ● {element.value}
      </Text>
    ));
  };

  renderPracticeApproveCard = (hospitalSList, practice_flag) => {
    const {t} = this.props;
    return hospitalSList.map((element) => (
      <View style={styles.practicesCardMainView}>
        <View style={styles.imageView}>
          {element.PRACTICE_IMAGE ? (
            this.renderPracticeImage(element)
          ) : (
            <Image source={Patients} style={styles.imageStyles} testID="patientsImage" accessibilityLabel="patientsImage"/>
          )}
        </View>

        <View style={styles.flex}>
          {/* Hospital section start */}
          <View style={styles.hospitalSectionMainView}>
            <View style={styles.width85}>
              <Text style={styles.hospitalName}
              testID={element.branch_name+"text"}
              accessibilityLabel={element.branch_name+"text"}>
                {nameConversion(element.branch_name)}
              </Text>
              <Text style={styles.hospitalAreaName}
              testID={element.CITY+"text"}
              accessibilityLabel={element.CITY+"text"}>{element.CITY}</Text>
            </View>
            <View style={styles.menuSymbolMainView}>
              <TouchableOpacity
                style={styles.flex}
                onPress={() =>
                  this.enableHospitalModal(element, practice_flag)
                }>
                <Menu 
                testID="menuOptions"
                accessibilityLabel="menuOptions"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* Hospital section end */}

          {/*  specialization and timings section start */}
          {practice_flag && (
            <View style={styles.specializationAndTimingView}>
              <View style={styles.width35}>
                <Text style={styles.specializationText}
                testID="specializationText"
                accessibilityLabel="specializationText">
                  {t('MY_PRACTICES.SPECIALIZATION')}
                </Text>
                <Text style={styles.specializationText}
                 testID="timingsText"
                 accessibilityLabel="timingsText">
                  {t('MY_PRACTICES.TIMINGS')}
                </Text>
              </View>
              <View style={styles.width3}>
                <Text style={styles.specializationValuesText}>-</Text>
                <Text style={styles.specializationValuesText}>-</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.specializationValuesText}
                  testID={element.specialization+"text"}
                  accessibilityLabel={element.specialization+"text"}>
                  {nameConversion(element.specialization)}
                </Text>
                <Text style={styles.timingsText}
                 testID={element.label+"text"}
                 accessibilityLabel={element.label+"text"}>
                  {this.renderPracticeWorkTimings(element)}
                </Text>
              </View>
            </View>
          )}

          {!practice_flag && (
            <View style={styles.specializationAndTimingView}>
              <Button
                style={styles.activateButtonView}
                onPress={() => this.activatePractice(element)}
                testID="activateAgainButton"
                accessibilityLabel="activateAgainButton">
                <Text style={styles.activateText}
                testID="activateAgainText"
                accessibilityLabel="activateAgainText">
                  {t('MY_PRACTICES.ACTIVATE_AGAIN')}
                </Text>
              </Button>
            </View>
          )}

          {/*  specialization and timings section start */}
        </View>
      </View>
    ));
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };

  navigateTo = (routeName, props) => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.props.navigation.navigate(routeName, {
          ...props,
        });
      },
    );
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.init().then(() => {
      this.setState({refreshing: false});
    });
  };

  practiceDeActivate = async () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({deActiveModal: true});
    }, 1000);
    // COMMENTED CODE FOR FUTURE REFERENCE

    // const selected_branch = this.state.selected_hospital;
    // const role = await AsyncStorage.getItem('role');
    // const {t} = this.props;
    // if (
    //   selected_branch?.standalone ||
    //   role.toLowerCase() === 'practice' ||
    //   role.toLowerCase() === 'execution team'
    // ) {
    //   // this.setState({
    //   //   deActiveModal: true,
    //   //   visible: false,
    //   // });
    // } else {
    //   this.setState({
    //     visible: false,
    //   });
    //   Toast.show({
    //     text: t('MY_PRACTICES.ERRORS.DE_ACTIVE_ROLE_ERROR_MESSAGE'),
    //     type: 'warning',
    //     duration: 5000,
    //   });
    // }
  };

  practiceActivate = async () => {
    const {t} = this.props;
    const selectedRequested = this.state.selected_hospital;
    const role = await AsyncStorage.getItem('role');
    const payload = {};

    try {
      const doctorId = await AsyncStorage.getItem('doctorid');

      payload.doctor_status = 'app';

      //  COMMENTED CODE FOR FUTURE REFERENCE

      // if (role.toLowerCase() === 'doctor' && !selectedRequested.standalone) {
      //   Toast.show({
      //     text: t('MY_PRACTICES.ERRORS.ACCESS_ROLE_ERROR'),
      //     type: 'warning',
      //     duration: 5000,
      //   });
      //   this.setState({
      //     visible: false,
      //   });
      //   return;
      // }

      // if (role.toLowerCase() === 'practice') {
      //   payload.doctor_status = 'ap';
      // } else if (
      //   role.toLowerCase() === 'execution team' ||
      //   selectedRequested.standalone
      // ) {
      //   payload.doctor_status = 'app';
      // }

      const response = await acceptNewPractice(
        doctorId,
        selectedRequested.work_timing_id,
        payload,
      );
      if (response) {
        Toast.show({
          text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_ACCEPT_SUCCESS'),
          type: 'success',
          duration: 5000,
        });
        this.getApprovedPracticeList();
        this.getDeclinedPracticeList();
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_ACCEPT_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    } finally {
      this.setState({
        visible: false,
      });
    }

    this.setState({
      visible: false,
    });
  };

  practiceCallUs = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({callModal: true});
    }, 1000);
  };

  practiceEmailUs = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({emailModal: true});
    }, 1000);
  };

  renderModal = () => {
    const selected_hospital = this.state.selected_hospital;
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.visible}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          {/* Hospital header and close Icon start */}
          <View style={styles.headerView}>
            <View style={[styles.flexDirectionRow, styles.hospitalViewMargin]}>
              <View style={styles.imageView}>
                {selected_hospital.PRACTICE_IMAGE ? (
                  this.renderPracticeImage(selected_hospital)
                ) : (
                  <Image source={Patients} style={styles.imageStyles} 
                  testID="patientsImage"
                  accessibilityLabel="patientsImage"/>
                )}
              </View>
              <View style={styles.width70}>
                <Text style={styles.hospitalName}
                testID={selected_hospital.branch_name+"Text"}
                accessibilityLabel={selected_hospital.branch_name+"Text"}>
                  {nameConversion(selected_hospital.branch_name)}
                </Text>
                <Text style={styles.hospitalAreaName}
                testID={selected_hospital.CITY+"Text"}
                accessibilityLabel={selected_hospital.CITY+"Text"}>
                  {nameConversion(selected_hospital.CITY)}
                </Text>
              </View>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={styles.touchableArea}
                onPress={() => this.closeModal()}>
                <Close height={18} width={18} style={styles.closeImage} 
                testID="closeIcon"
                accessibilityLabel="closeIcon"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* Hospital header and close Icon end */}

          {/* modal actions start */}
          <View style={styles.actionsModalView}>
            <PracticeActions
              headerText={t('MY_PRACTICES.EDIT_DOCTOR_TIMINGS')}
              subText={t('MY_PRACTICES.EDIT_DOCTOR_TIMINGS_SUB_TEXT')}
              touchableFlag={this.state.practice_flag}
              practiceAction={() =>
                this.navigateTo(NavRoutes.PRIVATE.DOCTOR_TIMINGS, {
                  branch_id: selected_hospital.branch_id,
                  slot_timing: selected_hospital.slot_timing,
                  stand_alone: selected_hospital.standalone,
                })
              }
              practiceIcon={<EditTimings />}
            />
            <PracticeActions
              headerText={t('MY_PRACTICES.VIEW_PRACTICE_SETTINGS')}
              subText={t('MY_PRACTICES.VIEW_PRACTICE_SETTINGS_SUB_TEXT')}
              touchableFlag={this.state.practice_flag}
              practiceAction={() =>
                this.navigateTo(NavRoutes.PRIVATE.PRACTICE_SETTINGS, {
                  branch_id: selected_hospital.branch_id,
                  slot_timing: selected_hospital.slot_timing,
                  stand_alone: selected_hospital.standalone,
                  work_timing_id: selected_hospital.work_timing_id,
                })
              }
              practiceIcon={<ViewPracticeSettings />}
            />
            {this.state.practice_flag ? (
              <PracticeActions
                headerText={t('MY_PRACTICES.DEACTIVATE_TEXT')}
                subText={t('MY_PRACTICES.DEACTIVATE_SUB_TEXT')}
                touchableFlag={true}
                practiceAction={() => this.practiceDeActivate()}
                practiceIcon={<DeactivateAndActivate />}
              />
            ) : (
              <PracticeActions
                headerText={t('MY_PRACTICES.ACTIVATE_TEXT')}
                subText={t('MY_PRACTICES.ACTIVATE_SUB_TEXT')}
                touchableFlag={true}
                practiceAction={() => this.practiceActivate()}
                practiceIcon={<DeactivateAndActivate />}
              />
            )}

            <PracticeActions
              headerText={t('MY_PRACTICES.CALL_US_TEXT')}
              subText={t('MY_PRACTICES.CALL_US_SUB_TEXT')}
              touchableFlag={true}
              practiceAction={() => this.practiceCallUs()}
              practiceIcon={<CallUs />}
            />

            <PracticeActions
              headerText={t('MY_PRACTICES.EMAIL_TEXT')}
              subText={t('MY_PRACTICES.EMAIL_SUB_TEXT')}
              touchableFlag={true}
              practiceAction={() => this.practiceEmailUs()}
              practiceIcon={<EmailUs />}
            />
          </View>
          {/* modal actions end */}
        </View>
      </Modal>
    );
  };

  closeDeActiveModal = () => {
    this.setState({
      deActiveModal: false,
    });
  };

  deActivatePractice = async () => {
    const {t} = this.props;
    const selectedRequested = this.state.selected_hospital;
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');

      const payload = {doctor_status: 'ap'};
      const response = await declineNewPractice(
        doctorId,
        selectedRequested.work_timing_id,
        payload,
      );
      if (response) {
        Toast.show({
          text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_DECLINED_SUCCESS'),
          type: 'success',
          duration: 5000,
        });
        this.getApprovedPracticeList();
        this.getDeclinedPracticeList();
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_DECLINED_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    } finally {
      this.setState({
        deActiveModal: false,
      });
    }
  };

  renderDeActiveWaringIconAndText = (text,testID) => {
    return (
      <View style={styles.warningIconAndTextView}>
        <View style={styles.itemsStart}>
          <CrossRed testID="wrongIcon" accessibilityLabel="wrongIcon"/>
        </View>
        <Text style={styles.warningText} testID={testID} accessibilityLabel={testID}>{text}</Text>
      </View>
    );
  };
  renderDeActivateText = () => {
    const {t} = this.props;
    return (
      <View style={styles.deActiveWaringSectionView}>
        <Text style={styles.deActiveWaringHeaderText}
        testID="youLostBelowFeaturesText"
        accessibilityLabel="youLostBelowFeaturesText">
          {t('MY_PRACTICES.DEACTIVATE_HEADING')}
        </Text>
        {this.renderDeActiveWaringIconAndText(
          t('MY_PRACTICES.DEACTIVATE_WARING_TEXT1'), "cantEditPersonHistoryText"
        )}
        {this.renderDeActiveWaringIconAndText(
          t('MY_PRACTICES.DEACTIVATE_WARING_TEXT2'), "CantTakeActionOnAppointments"
        )}
        {this.renderDeActiveWaringIconAndText(
          t('MY_PRACTICES.DEACTIVATE_WARING_TEXT3'), "CantTakeActionOnCovidPatients"
        )}
      </View>
    );
  };

  updateConfirmDeActivate = () => {
    this.setState((prevState) => ({
      deActivateConfirm: !prevState.deActivateConfirm,
    }));
  };

  renderDeActiveModalButtons = () => {
    const {t} = this.props;
    return (
      <View style={styles.deActiveButtonsView}>
        <Button
          androidRippleColor={DEFAULT_GREY_COLOR}
          style={styles.deActiveYesButton}
          onPress={() => this.updateConfirmDeActivate()}
          testID="yesButton"
          accessibilityLabel="yesButton">
          <Text style={styles.yesButtonText}
          testID="yesText"
          accessibilityLabel="yesText">{t('MY_PRACTICES.YES')}</Text>
        </Button>
        <Button
          style={styles.deActiveNoButton}
          onPress={() => this.closeDeActiveModal()}>
          <Text style={styles.noButtonText}
          testID="donotActivateText"
          accessibilityLabel="donotActivateText">
            {t('MY_PRACTICES.DONOT_ACTIVATE')}
          </Text>
        </Button>
      </View>
    );
  };

  renderDeActiveConfirmAndCancelButtons = () => {
    const {t} = this.props;
    return (
      <View style={styles.deActiveButtonsView}>
        <Button
          androidRippleColor={DEFAULT_GREY_COLOR}
          style={styles.deActiveYesButton}
          onPress={() => this.closeDeActiveModal()}
          testID="cancelButton"
          accessibilityLabel="cancelButton">
          <Text style={styles.yesButtonText}
          testID="cancelText"
          accessibilityLabel="cancelText">{t('MY_PRACTICES.CANCEL')}</Text>
        </Button>
        <Button
          style={styles.confirmButton}
          onPress={() => this.deActivatePractice()}
          testID="confirmButton"
          accessibilityLabel="confirmButton">
          <Text style={styles.noButtonText}
          testID="confirmText" accessibilityLabel="confirmText">{t('MY_PRACTICES.CONFIRM')}</Text>
        </Button>
      </View>
    );
  };

  handlePasswordChange = (text) => {
    this.setState((prevState) => ({
      password: text,
    }));
  };

  renderConfirmPasswordAndButtons = () => {
    const {t} = this.props;
    return (
      <View style={{marginTop: 15, marginBottom: 15}}>
        <Text style={styles.confirmTextHeading}
        testID="EnterCurrentPasswordHeadingText"
        accessibilityLabel="EnterCurrentPasswordHeadingText">
          {t('MY_PRACTICES.CONFIRM_PASSWORD_HEADING')}
        </Text>
        <Text style={styles.currentPasswordText}
        testID="CurrentPaawordText"
        accessibilityLabel="CurrentPaawordText">
          {t('MY_PRACTICES.CURRENT_PASSWORD')}
        </Text>
        <TextInput
         testID="CurrentPasswordText"
         accessibilityLabel="CurrentPasswordText"
          onChangeText={(text) => this.handlePasswordChange(text)}
          placeholder={t('MY_PRACTICES.PASSWORD')}
          style={styles.passwordInput}
        />
        {this.renderDeActiveConfirmAndCancelButtons()}
      </View>
    );
  };

  renderDeActivateModal = () => {
    const selected_hospital = this.state.selected_hospital;
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.deActiveModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeDeActiveModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.deActiveModal}>
          <View style={styles.headerView}>
            <View
              style={[
                styles.flexDirectionRow,
                styles.hospitalViewMargin,
                styles.width90,
              ]}>
              <Text style={styles.deActiveText}
              testID="deactivateConfirmText"
              accessibilityLabel="deactivateConfirmText">
                {t('MY_PRACTICES.DEACTIVATE_CONFIRM_TEXT')}{' '}
                {nameConversion(selected_hospital.branch_name)},{' '}
                {nameConversion(selected_hospital.CITY)}
              </Text>
            </View>
            <View style={styles.closeImageStyles}>
              <TouchableOpacity
                style={[styles.touchableArea, styles.closeImageStyles]}
                onPress={() => this.closeDeActiveModal()}>
                <Close height={15} width={15} style={styles.closeImage} 
                testID="closeIcon"
                accessibilityLabel="closeIcon"/>
              </TouchableOpacity>
            </View>
          </View>
          {this.renderDeActivateText()}
          {!this.state.deActivateConfirm && this.renderDeActiveModalButtons()}
          {this.state.deActivateConfirm &&
            this.renderConfirmPasswordAndButtons()}
        </View>
      </Modal>
    );
  };

  renderCallOptions = () => {
    this.setState((prevState) => ({
      callModal: !prevState.callModal,
    }));
  };

  renderEmailOptions = () => {
    this.setState((prevState) => ({
      emailModal: !prevState.emailModal,
    }));
  };

  render() {
    const {t} = this.props;
    return (
      <Container style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={styles.approvedPractices}>
            <Text style={styles.approvedPracticeText}
            testID="yourApprovedPracticesText"
            accessibilityLabel="yourApprovedPracticesText">
              {t('MY_PRACTICES.YOUR_APPROVED_PRACTICES')}
            </Text>
          </View>
          {this.state?.approved_practices &&
            this.renderPracticeApproveCard(this.state.approved_practices, true)}

          {!!this.state.declined_practices.length > 0 && (
            <View style={styles.approvedPractices}>
              <Text
                style={[styles.approvedPracticeText, styles.textPaddingBottom]}
                testID="yourDeclinePracticesText"
                accessibilityLabel="yourDeclinePracticesText">
                {t('MY_PRACTICES.YOUR_DECLINE_PRACTICES')}
              </Text>
            </View>
          )}

          {this.state.declined_practices &&
            this.renderPracticeApproveCard(
              this.state.declined_practices,
              false,
            )}

          {this.renderModal()}
          {this.renderDeActivateModal()}

          {this.state.callModal && (
            <CallModal
              phoneNumber={
                this.state.selected_hospital?.MOBILE?.split('-')[1] || ''
              }
              modal={this.state.callModal}
              renderCallOptions={() => this.renderCallOptions()}
            />
          )}

          {this.state.emailModal && (
            <EmailModal
              email={this.state.selected_hospital?.EMAIL || ''}
              modal={this.state.emailModal}
              renderCallOptions={() => this.renderEmailOptions()}
            />
          )}
        </ScrollView>
      </Container>
    );
  }
}

export default withTranslation()(Practices);
