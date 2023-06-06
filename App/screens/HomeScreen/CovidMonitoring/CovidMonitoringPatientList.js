import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  FlatList,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  Container,
  Card,
  CardItem,
  Item,
  Input,
  Form,
  Toast,
  Button,
  CheckBox,
  ListItem,
  Body,
} from 'native-base';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {connect} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getCovidMonitorList,
  closeEncounterStatus,
  reopenEncounterStatus,
} from '../../../redux/actions/covidmonitoring_action';
import ConfirmDialog from '../Common/ConfirmDialog';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
} from '../../../themes/variable';
import styles from './CovidMonitoringPatientListStyle';
import {isPortrait} from './Utils/Utils';
import PatientConsentModal from '../Common/PatientConsentModal';

//images
import Call from '../../../assets/images/call.png';
import WhatsApp from '../../../assets/images/whatsapp.png';
import heAlpha from '../../../assets/images/heAlpha.png';
import Close from '../../../assets/images/close.png';
import SearchPatients from '../../../assets/images/search_patients.png';
import FilterPatients from '../../../assets/images/filter.png';
import BackArrow from '../../../assets/images/back_arrow.png';
import ChangeDateIcon from '../../../assets/images/dateIcon.png';
import getBaseUrl, {
  getDevelopmentUrl,
  getEnvironmentObject,
} from '../../../config/Config';
import {getCountryCode} from '../../../utils/CountryCode';
import {Picker} from '@react-native-picker/picker';

// redux actions

import {TwilioConnection} from '../../../redux/actions/TwilioActions';
class CovidMonitoringPatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      token: '',
      status: '',
      date: new Date(),
      doctor_id: '',
      doctor_name: '',
      practice_id: '',
      branch_id: '',
      branch_name: '',
      visible: false,
      search: '',
      filter: null,
      action: null,
      patient: {},
      role: 'doctor',
      selected_doctor_id: '',
      refreshing: false,
      confirmDialogData: {},
      portrait: isPortrait(),
      show: false,
      showPatientConsentModal: false,
      call: false,
      patientPhoneNumber: '',
      risk: 'high',
      closeModal: false,
      patientComment: '',
      patientCommentText: '',
      modalHeight: '65%',
      isLoading: false,
      searchEnable: false,
      filtersEnable: false,
      patientFilter: '',
      loader: false,
      selected_patient: {},
    };

    this.action = {
      review: 'review',
      patient_consent: 'patient_consent',
      initial_assessment: 'initial_assessment',
      prescription: 'prescription',
      preview: 'preview',
      report: 'report',
      close: 'close',
      reopen: 'reopen',
    };

    Dimensions.addEventListener('change', () => {
      this.setState({portrait: isPortrait()});
    });

    this.onDateChange = this.onDateChange.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.hidePatientConsentModal = this.hidePatientConsentModal.bind(this);
    this.redirectToNotifications = this.redirectToNotifications.bind(this);
    this.textWhatsApp = this.textWhatsApp.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
  }

  componentDidMount() {
    this.init();
    this.props.navigation.setParams({
      redirectToNotifications: this.redirectToNotifications,
    });
    this.props.navigation.addListener('willFocus', this._handleStateChange);
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    this.getCovidMonitorList();
  };

  redirectToNotifications() {
    this.props.navigation.navigate('notificationsList');
  }

  keyboardDidShow(e) {
    this.setState({
      modalHeight: '100%',
    });
  }
  keyboardDidHide(e) {
    this.setState({
      modalHeight: '65%',
    });
  }

  componentWillMount() {
    Keyboard.addListener('keyboardDidShow', (e) => this.keyboardDidShow(e));
    Keyboard.addListener('keyboardDidHide', (e) => this.keyboardDidHide(e));
  }

  toggleDatePicker() {
    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  }

  init = async () => {
    console.log('twiliolist');
    // {global.twilioconnected && global.twilioviewpdf?
    // Alert.alert(
    //   'Disconnecting the Healpha Call with',
    //   global.twiliopatienname,
    //   [
    //     {text: 'Yes', onPress: () => {
    // global.twilioviewpdf= false
    // global.twilioconnected= false
    // DeviceEventEmitter.emit('eventTwilioDisconnect', { data: 'disconnect'});
    //   }},
    // ],
    // {cancelable: false},
    // ):null}
    // {global.twilioconnected && global.twilioviewpdf &&(
    //   global.twilioviewpdf= false,
    //   global.twilioconnected= false,
    //   DeviceEventEmitter.emit('eventTwilioDisconnect', { data: 'disconnect'}),
    //   alert('Disconnecting the Healpha Call with '+global.twiliopatienname)
    // )}
    const {params} = this.props.navigation.state;

    if (!params) {
      return;
    }

    const {
      token,
      status,
      date,
      doctor_id,
      practice_id,
      branch_id,
      branch_name,
      selected_doctor_id,
    } = params;

    const doctor_name = await AsyncStorage.getItem('doctorname');
    const role = await AsyncStorage.getItem('role');

    this.setState(
      {
        token,
        status,
        date,
        doctor_id,
        practice_id,
        branch_id,
        branch_name,
        doctor_name,
        selected_doctor_id,
        role,
      },
      () => this.getCovidMonitorList(),
    );
  };

  getCovidMonitorList = async () => {
    const payload = {
      id: this.state.doctor_id,
      token: this.state.token,
      practiceid: this.state.practice_id,
      branchid: this.state.branch_id,
      filter_date: moment(this.state.date).format('YYYY-MM-DD'),
      status: this.state.status,
      selected_doctor_nh_id: this.state.selected_doctor_id,
      doctor_flag: '1',
      role: this.state.role,
    };
    this.setState({covidMonitorList: []});
    await this.props.getCovidMonitorList(payload);
    this.setState({
      covidMonitorList: this.props.covidMonitorList,
      search: '',
      filter: '',
    });
  };

  closeEncounterStatus = async () => {
    const {t} = this.props;
    const payload = {
      id: this.state.doctor_id,
      token: this.state.token,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      role_type: this.state.role,
      name: this.state.doctor_name,
      doctor_flag: '1',
      role: this.state.role,
    };
    await this.props.closeEncounterStatus(payload);
    this.sendNotification(
      t('MESSAGES.CLOSE_ENCOUNTER_MESSAGE', {
        doctor_name: this.state.doctor_name,
        patient_name: this.state.patient.patient_name,
        comment: this.state.patientCommentText,
      }),
    );
    this.patientCloseNoAction();
    this.setState({
      visible: false,
      action: null,
      patient: {},
      closeModal: false,
      isLoading: false,
    });
    Toast.show({
      text: this.props.closeEncounterStatusData?.message,
      type: 'success',
      duration: 5000,
    });
    this.getCovidMonitorList();
  };

  reopenEncounterStatus = async () => {
    const payload = {
      id: this.state.doctor_id,
      token: this.state.token,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      role_type: this.state.role,
      name: this.state.doctor_name,
      doctor_flag: '1',
      role: this.state.role,
    };
    await this.props.reopenEncounterStatus(payload);
    this.setState({visible: false, action: null, patient: {}});
    Toast.show({
      text: this.props.reopenEncounterStatusData?.message,
      type: 'success',
      duration: 5000,
    });
    this.getCovidMonitorList();
  };

  onDateChange(selectedDate) {
    this.setState(
      {
        date: selectedDate,
        show: false,
      },
      () => this.getCovidMonitorList(),
    );
  }

  onChangeText(text) {
    this.setState({search: text}, () => this.performFilter());
  }

  onFilterChange(value) {
    this.setState(
      {filter: value, patientFilter: value, filtersEnable: false, loader: true},
      () => this.performFilter(),
    );
  }

  hidePatientConsentModal(value) {
    const {t} = this.props;
    if (value) {
      this.sendNotification(
        t('MESSAGES.GIVEN_CONSENT_ON_BEHALF', {
          doctor_name: this.state.doctor_name,
          patient_name: this.state.patient.patient_name,
        }),
      );
      this.getCovidMonitorList();
    }
    this.setState({showPatientConsentModal: false, patient: {}});
  }

  performFilter() {
    let {covidMonitorList} = this.props;

    switch (this.state.filter) {
      case 'pending_first_review':
        covidMonitorList = covidMonitorList.filter(
          (each) => each.doctor_count === '0',
        );
        break;
      case 'pending_second_review':
        covidMonitorList = covidMonitorList.filter(
          (each) => each.doctor_count === '1',
        );
        break;
      case 'pending_nurse_review':
        covidMonitorList = covidMonitorList.filter(
          (each) => each.nurse_count === '0',
        );
        break;
      case 'pending_dietician_review':
        covidMonitorList = covidMonitorList.filter(
          (each) => each.dietician_count === '0',
        );
        break;
      case 'pending_physiotherapy_review':
        covidMonitorList = covidMonitorList.filter(
          (each) => each.physiotherapist_count === '0',
        );
        break;
      default:
        break;
    }

    if (this.state.search) {
      covidMonitorList = covidMonitorList.filter(
        (each) =>
          each.patient_name
            ?.toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          each.phone_no
            ?.toLowerCase()
            .includes(this.state.search.toLowerCase()),
      );
    }

    this.setState({covidMonitorList, loader: false});
  }

  checkValidations(action, patient) {
    const {t} = this.props;
    if (action === this.action.preview && !patient.preview_file_path) {
      Toast.show({
        text: t('COVID_MONITORING.PREVIEW_NOT_AVAILABLE'),
        duration: 5000,
      });
      return false;
    } else if (action === this.action.report && !patient.report_file_path) {
      Toast.show({
        text: t('COVID_MONITORING.REPORT_NOT_AVAILABLE'),
        duration: 5000,
      });
      return false;
    }
    return true;
  }

  performPatientConsentAction(action, patient) {
    const {t} = this.props;
    if (patient.patientconsent_file_path) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${patient.patientconsent_file_path}`,
        title: t('PROFILE.PATIENT_CONSENT'),
      });
    } else {
      if (this.state.status === 'closed') {
        Toast.show({
          text: t('COVID_MONITORING.PATIENT_CONSENT_NOT_COMPLETED'),
          duration: 5000,
        });
      } else {
        this.showDialog(action);
      }
    }
  }

  performInitialAssessmentAction(action, patient) {
    const {t} = this.props;
    if (patient.is_initial_assessment && patient.initial_assessment_file_path) {
      if (
        this.state.role === 'physiotherapist' ||
        this.state.role === 'dietician' ||
        this.state.status === 'closed'
      ) {
        this.props.navigation.navigate('ViewPdf', {
          link: `${getDevelopmentUrl()}/${
            patient.initial_assessment_file_path
          }`,
          title: t('PROFILE.INITIAL_ASSESSMENT'),
        });
      } else {
        this.showDialog(action);
      }
    } else {
      if (
        this.state.role === 'physiotherapist' ||
        this.state.role === 'dietician' ||
        this.state.status === 'closed'
      ) {
        Toast.show({
          text: t('COVID_MONITORING.INITIAL_ASSESSMENT_NOT_AVAILABLE'),
          duration: 5000,
        });
      } else {
        this.props.navigation.navigate('CovidMonitoringInitialAssessment', {
          token: this.state.token,
          doctor_id: this.state.doctor_id,
          doctor_name: this.state.doctor_name,
          patient,
          from: 'initial_assessment',
        });
      }
    }
  }

  performPrescriptionAction(action, patient) {
    const {t} = this.props;
    if (
      (patient.is_initial_assessment && !patient.is_prescription) ||
      (!patient.is_initial_assessment && !patient.is_prescription)
    ) {
      if (
        this.state.role === 'physiotherapist' ||
        this.state.role === 'dietician' ||
        this.state.status === 'closed'
      ) {
        Toast.show({
          text: t('COVID_MONITORING.PRESCRIPTION_NOT_AVAILABLE'),
          duration: 5000,
        });
      } else {
        this.navigateToHomeScreen();
      }
    } else if (
      (!patient.is_initial_assessment && patient.is_prescription) ||
      (patient.is_initial_assessment && patient.is_prescription)
    ) {
      if (
        this.state.role === 'physiotherapist' ||
        this.state.role === 'dietician' ||
        this.state.status === 'closed'
      ) {
        this.props.navigation.navigate('ViewPdf', {
          link: `${getDevelopmentUrl()}/${patient.prescription_file_path}`,
          title: t('PROFILE.PRESCRIPTION'),
        });
      } else {
        this.showDialog(action);
      }
    }
  }

  performActions(action, patient) {
    const {t} = this.props;
    if (action === this.action.review) {
      if (!patient.patientconsent_file_path) {
        Toast.show({
          text: t('COVID_MONITORING.PATIENT_CONSENT_NOT_COMPLETED'),
          duration: 5000,
        });
      } else if (!patient.initial_assessment_file_path) {
        Toast.show({
          text: t('COVID_MONITORING.INITIAL_ASSESSMENT_NOT_AVAILABLE'),
          duration: 5000,
        });
      } else {
        this.navigateToPatientView(patient);
      }
    } else if (action === this.action.patient_consent) {
      this.performPatientConsentAction(action, patient);
    } else if (action === this.action.initial_assessment) {
      this.performInitialAssessmentAction(action, patient);
    } else if (action === this.action.prescription) {
      this.performPrescriptionAction(action, patient);
    } else if (action === this.action.preview && patient.preview_file_path) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${patient.preview_file_path}`,
        title: t('PROFILE.PREVIEW'),
      });
    } else if (action === this.action.report && patient.report_file_path) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${patient.report_file_path}`,
        title: t('PROFILE.REPORT'),
      });
    } else if (action === this.action.close) {
      this.showDialog(action);
    } else if (action === this.action.reopen) {
      this.showDialog(action);
    }
  }

  onActionClick(action, patient) {
    if (!this.checkValidations(action, patient)) {
      return;
    }
    this.setState({patient}, () => this.performActions(action, patient));
  }

  showDialog(action) {
    const {t} = this.props;
    let confirmDialogData = {};

    if (action === this.action.patient_consent) {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_PATIENT_CONSENT_DIALOG_TITLE'),
        content: t('RECORD_VITAL.CONFIRM_PATIENT_CONSENT_DIALOG_CONTENT'),
        noLabel: t('PATIENTS.GIVE'),
        yesLabel: t('PATIENTS.SEND'),
      };
    } else if (action === this.action.initial_assessment) {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_INITIAL_ASSESSMENT_DIALOG_TITLE'),
        content: t(
          'COVID_MONITORING.CONFIRM_INITIAL_ASSESSMENT_DIALOG_CONTENT',
        ),
        noLabel: t('COMMON.EDIT'),
        yesLabel: t('COMMON.VIEW'),
      };
    } else if (action === this.action.prescription) {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_PRESCRIPTION_DIALOG_TITLE'),
        content: t('COVID_MONITORING.CONFIRM_PRESCRIPTION_DIALOG_CONTENT'),
        noLabel: t('COMMON.EDIT'),
        yesLabel: t('COMMON.VIEW'),
      };
    } else if (action === this.action.close) {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_CLOSE_DIALOG_TITLE'),
        content: t('COVID_MONITORING.CONFIRM_CLOSE_DIALOG_CONTENT'),
        noLabel: t('COMMON.CANCEL'),
        yesLabel: t('COMMON.OK'),
      };
    } else if (action === this.action.reopen) {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_REOPEN_DIALOG_TITLE'),
        content: t('COVID_MONITORING.CONFIRM_REOPEN_DIALOG_CONTENT'),
        noLabel: t('COMMON.CANCEL'),
        yesLabel: t('COMMON.OK'),
      };
    }

    this.setState({
      visible:
        action === this.action.reopen
          ? true
          : action === this.action.initial_assessment
          ? true
          : action === this.action.prescription
          ? true
          : action === this.action.patient_consent
          ? true
          : false,
      action,
      confirmDialogData,
      closeModal: action === this.action.close ? true : false,
    });
  }

  hideDialog(confirm) {
    const {t} = this.props;

    if (this.state.action === this.action.patient_consent && confirm) {
      this.sendNotification(
        t('MESSAGES.COMPLETE_THE_CONSENT', {
          patient_name: this.state.patient.patient_name,
        }),
      );
    }
    if (
      this.state.action === this.action.patient_consent &&
      confirm === false
    ) {
      this.setState({
        showPatientConsentModal: true,
        visible: false,
        action: null,
        confirmDialogData: {},
      });
      return;
    } else if (
      this.state.action === this.action.initial_assessment &&
      confirm
    ) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${
          this.state.patient.initial_assessment_file_path
        }`,
        title: t('PROFILE.INITIAL_ASSESSMENT'),
      });
    } else if (
      this.state.action === this.action.initial_assessment &&
      confirm === false
    ) {
      this.props.navigation.navigate('CovidMonitoringInitialAssessment', {
        token: this.state.token,
        doctor_id: this.state.doctor_id,
        doctor_name: this.state.doctor_name,
        patient: this.state.patient,
        from: 'initial_assessment',
      });
    } else if (this.state.action === this.action.prescription && confirm) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${
          this.state.patient.prescription_file_path
        }`,
        title: t('PROFILE.PRESCRIPTION'),
      });
    } else if (
      this.state.action === this.action.prescription &&
      confirm === false
    ) {
      this.navigateToTimeline();
    } else if (this.state.action === this.action.close && confirm) {
      this.closeEncounterStatus();
    } else if (this.state.action === this.action.reopen && confirm) {
      this.reopenEncounterStatus();
    }

    this.setState({
      visible: false,
      action: null,
      confirmDialogData: {},
      // patient: {},
    });
  }

  navigateToPatientView(patient) {
    this.props.navigation.navigate('CovidMonitoringPatientView', {
      token: this.state.token,
      doctor_id: this.state.doctor_id,
      doctor_name: this.state.doctor_name,
      selected_doctor_id: this.state.selected_doctor_id,
      status: this.state.status,
      patient,
      initialPage: 0,
    });
  }

  navigateToHomeScreen() {
    this.props.navigation.navigate('HomeScreen', {
      branch_id: this.state.branch_id,
      branch_name: this.state.branch_name,
      aasha: 'No',
      open_consult_popup: true,
      schedule_date: this.state.patient.schedule_date,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      enc_version: this.state.patient.enc_version,
    });
  }

  navigateToTimeline() {
    this.props.navigation.navigate('HomeScreen', {
      docid: this.state.doctor_id,
      branch_id: this.state.branch_id,
      open_consult_popup: true,
      schedule_date: this.state.patient.schedule_date,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      enc_version: this.state.patient.enc_version,
    });
  }

  sendNotification = async (content) => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    console.log('qwerty', deviceToken);
    const {t} = this.props,
      url = getBaseUrl() + 'notify_patient/',
      payload = JSON.stringify({
        hlp: this.state.patient.hlpid,
        doc: this.state.selected_doctor_id,
        token: this.state.token,
        node_token: deviceToken,
        content: content,
      });
    console.log('myurl', url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('notifyperson',payload);
        Toast.show({
          text: t('MESSAGES.NOTIFICATION_SENT_SUCCESSFULLY'),
          type: 'success',
          duration: 5000,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getCovidMonitorList().then(() => {
      this.setState({refreshing: false});
    });
  };

  renderPatientConsentModal() {
    const {t} = this.props;
    return (
      <PatientConsentModal
        visible={this.state.showPatientConsentModal}
        onDismiss={this.hidePatientConsentModal}
        title={t('COMMON.GIVE_CONSENT')}
        token={this.state.token}
        doctor_id={this.state.doctor_id}
        doctor_name={this.state.doctor_name}
        patient={this.state.patient}
      />
    );
  }

  renderConfirmDialog() {
    return (
      <ConfirmDialog
        visible={this.state.visible}
        onDismiss={this.hideDialog}
        title={this.state.confirmDialogData.title}
        content={this.state.confirmDialogData.content}
        noLabel={this.state.confirmDialogData.noLabel}
        yesLabel={this.state.confirmDialogData.yesLabel}
      />
    );
  }

  renderStatusButton(id, label, patient, active, styleName) {
    return (
      <Button
        rounded
        androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
        style={[
          styles.button,
          active ? styles.activeActionButton : styles.actionButton,
          styleName,
        ]}
        onPress={() => this.onActionClick(id, patient)} 
        testID={label+"button"}
        accessibilityLabel={label+"button"}>
        <Text
          style={
            active ? styles.activeActionButtonText : styles.actionButtonText
          }
          testID={label+"text"}
          accessibilityLabel={label+"text"}>
          {label}
        </Text>
      </Button>
    );
  }

  renderActions(patient) {
    const {t} = this.props;
    return (
      <View style={styles.actionsView}>
        <View style={styles.eachActionRowView}>
          {this.renderStatusButton(
            this.action.patient_consent,
            t('COVID_MONITORING.PATIENT_CONSENT'),
            patient,
            patient.is_patient_consent,
            styles.firstActionButton,
            "patientConsentText"
          )}
          {this.renderStatusButton(
            this.action.initial_assessment,
            t('COVID_MONITORING.INITIAL_ASSESSMENT'),
            patient,
            patient.is_initial_assessment,
            styles.largeActionButton,
            "initialAssessmentText"
          )}
        </View>
        <View style={styles.eachActionRowView}>
          {this.renderStatusButton(
            this.action.prescription,
            t('COVID_MONITORING.PRESCRIPTION'),
            patient,
            patient.is_prescription,
            styles.firstActionButton,
            "prescriptionText"
          )}
          {this.state.status !== 'closed' &&
            this.renderStatusButton(
              this.action.preview,
              t('COVID_MONITORING.PREVIEW'),
              patient,
              patient.is_preview,
              styles.smallActionButton,
              "previewText"
            )}
          {this.state.status === 'closed' &&
            this.renderStatusButton(
              this.action.report,
              t('COVID_MONITORING.REPORT'),
              patient,
              patient.is_report,
              styles.smallActionButton,
              "reportText"
            )}
          {this.state.role !== 'physiotherapist' &&
            this.state.role !== 'dietician' &&
            this.renderStatusButton(
              this.state.status === 'closed'
                ? this.action.reopen
                : this.action.close,
              this.state.status === 'closed'
                ? t('COMMON.REOPEN')
                : t('COMMON.CLOSE'),
              patient,
              false,
              styles.smallActionButton,
            )}
        </View>
      </View>
    );
  }

  renderEachReview(label, count, margin) {
    return (
      <Text
        style={[
          styles.countButtonText,
          margin ? styles.countsMargin : {},
        ]}
        testID={label+count+"text"}
        accessibilityLabel={label+count+"text"}>{`${label} - ${count}`}</Text>
    );
  }

  renderReviews(patient) {
    const {t} = this.props;
    return (
      <View style={[styles.reviewsView]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.reviewsCountView}>
          {this.renderEachReview(
            t('COVID_MONITORING.DOCTOR'),
            patient.doctor_count,
            'yes',
            "doctorText"
          )}
          {this.renderEachReview(
            t('COVID_MONITORING.NURSE'),
            patient.nurse_count,
            'yes',
            "nurseText"
          )}
          {this.renderEachReview(
            t('COVID_MONITORING.DIETICIAN'),
            patient.dietician_count,
            'yes',
            "dieticianText"
          )}
          {this.renderEachReview(
            t('COVID_MONITORING.PHYSIOTHERAPY'),
            patient.physiotherapist_count,
            '',
            "physiotherapyText"
          )}
        </ScrollView>
      </View>
    );
  }

  enableCallOptions(
    patientPhoneNumber,
    patientPhoneCode,
    patientEncId,
    patientHlpId,
    patientName,
    encVersionNum,
    patient,
  ) {
    this.setState((prevState) => ({
      call: true,
      patientPhoneNumber: patientPhoneNumber,
      patientPhoneCode: patientPhoneCode,
      healphaCallEncID: patientEncId,
      healphaCallHlpID: patientHlpId,
      healphaCallName: patientName,
      healphaCallEncVerNo: encVersionNum,
      selected_patient: patient,
    }));
  }

  renderDetails(patient) {
    const {t} = this.props;
    return (
      <View style={styles.detailsView}>
        <View style={styles.detailsTextView}>
          <Text style={styles.patientNameText}
          testID={patient.patient_name+"text"}
          accessibilityLabel={patient.patient_name+"text"}>
            {`${patient.patient_name}`}
          </Text>
          <Text style={styles.phoneNumberText}
          testID={patient.phone_no+"text"}
          accessibilityLabel={patient.phone_no+"text"}>{`${patient.phone_no}`}</Text>
        </View>
        {this.state.status !== 'closed' && (
          <View style={styles.callView}>
            <Button
              rounded
              androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
              style={[styles.button, styles.reviewButton, styles.callButton]}
              onPress={() =>
                this.enableCallOptions(
                  patient?.phone_no,
                  patient?.phone_code,
                  patient?.enc_id,
                  patient?.hlpid,
                  patient?.patient_name,
                  patient?.enc_version,
                  patient,
                )
              }
              testID="callButton"
              accessibilityLabel="callButton">
              <Image source={Call} style={styles.callImageStyles} 
              testID="callImage"
              accessibilityLabel="callImage"/>
            </Button>
            <Button
              rounded
              androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
              style={[styles.button, styles.reviewButton]}
              onPress={() => this.onActionClick('review', patient)}
              testID="reviewButton"
              accessibilityLabel="reviewButton">
              <Text style={styles.reviewButtonText}
              testID="reviewText"
              accessibilityLabel="reviewText">
                {t('COVID_MONITORING.REVIEW')}
              </Text>
            </Button>
          </View>
        )}
      </View>
    );
  }

  renderPatientItem({item}) {
    return (
      <Card style={styles.patientCardView}>
        <CardItem
          style={[styles.patientCardItemView, styles.cardPaddingStyles]}
          cardBody>
          {this.renderDetails(item)}
          {this.renderReviews(item)}
        </CardItem>
        <CardItem
          style={[styles.actionCardItemView, styles.cardPaddingStyles]}
          bordered
          cardBody>
          {this.renderActions(item)}
        </CardItem>
      </Card>
    );
  }

  renderPatientList() {
    return (
      <SafeAreaView style={styles.patientListView}>
        <FlatList
          data={this.state.covidMonitorList}
          renderItem={this.renderPatientItem.bind(this)}
          keyExtractor={(item) => `${item.hlpid}-${item.enc_id}`}
          key={this.state.portrait ? '_' : '#'}
          numColumns={this.state.portrait ? 1 : 2}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  }

  renderInputFields() {
    const {t} = this.props;
    return (
      <View style={styles.inputFieldsView}>
        <Form style={styles.inputFieldsRow}>
          <Item picker style={styles.inputFieldFilter}>
            <Picker
              testID="filterPicker"
              accessibilityLabel="filterPicker"
              mode="dropdown"
              placeholder={t('COMMON.FILTER')}
              style={styles.picker}
              placeholderStyle={styles.textColorBlack}
              selectedValue={this.state.filter}
              onValueChange={this.onFilterChange}>
              <Picker.Item
                label={t('COMMON.FILTER')}
                value={null}
                key={'filter'}
              />
              <Picker.Item
                label={t('COVID_MONITORING.PENDING_FIRST_REVIEW')}
                value={'pending_first_review'}
                key={'pending_first_review'}
              />
              <Picker.Item
                label={t('COVID_MONITORING.PENDING_SECOND_REVIEW')}
                value={'pending_second_review'}
                key={'pending_second_review'}
              />
              <Picker.Item
                label={t('COVID_MONITORING.PENDING_NURSE_REVIEW')}
                value={'pending_nurse_review'}
                key={'pending_nurse_review'}
              />
              <Picker.Item
                label={t('COVID_MONITORING.PENDING_DIETICIAN_REVIEW')}
                value={'pending_dietician_review'}
                key={'pending_dietician_review'}
              />
              <Picker.Item
                label={t('COVID_MONITORING.PENDING_PHYSIOTHERAPY_REVIEW')}
                value={'pending_physiotherapy_review'}
                key={'pending_physiotherapy_review'}
              />
            </Picker>
          </Item>
          <Item style={styles.inputFieldSearch}>
            <Input
            testID="searchInput"
            accessibilityLabel="searchInput"
              placeholder={t('COMMON.SEARCH')}
              value={this.state.search}
              onChangeText={this.onChangeText}
            />
          </Item>
        </Form>
      </View>
    );
  }

  renderHeader() {
    const {t} = this.props;
    let minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 6);

    return (
      <View style={styles.header}>
        <Text style={styles.title}
        testID={"covidMonitoringText"+this.state.status.toUpperCase()}
        accessibilityLabel={"covidMonitoringText"+this.state.status.toUpperCase()}>
          {`(${this.state.covidMonitorList?.length || 0}) ${t(
            'COVID_MONITORING.' + this.state.status.toUpperCase(),
          )} on `}
        </Text>
        <View style={styles.dateSelect}>
          <TouchableOpacity
             testID="dateTimePickerTouch"
             accessibilityLabel="dateTimePickerTouch"
            onPress={() => this.setState({show: true})}
            style={styles.dateField}>
            <Text
               testID={moment(this.state.date).format('DD-MMM-YYYY')+"text"}
               accessibilityLabel={moment(this.state.date).format('DD-MMM-YYYY')+"text"}>{moment(this.state.date).format('DD-MMM-YYYY')}</Text>
            <Image source={ChangeDateIcon} style={styles.dateIconStyles} 
               testID="dateTimePicker"
               accessibilityLabel="dateTimePicker"/>
          </TouchableOpacity>
          <DateTimePickerModal
          testID="dateTimePicker"
          accessibilityLabel="dateTimePicker"
            isVisible={this.state.show}
            mode="date"
            date={new Date(this.state.date)}
            minimumDate={new Date(minDate)}
            maximumDate={new Date()}
            onConfirm={this.onDateChange}
            onCancel={this.toggleDatePicker}
          />
        </View>
      </View>
    );
  }

  renderActivityIndicator() {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
      </View>
    );
  }

  toggleCallModal() {
    this.setState((prevState) => ({
      call: !prevState.call,
    }));
  }

  callPhone = async () => {
    if (!this.state.patientPhoneNumber) {
      return;
    }
    let url = '';

    const country_code = await getCountryCode();

    if (Platform.OS === 'android') {
      url = 'tel:' + country_code + this.state.patientPhoneNumber;
    } else {
      url = 'telprompt:' + country_code + this.state.patientPhoneNumber;
    }
    Linking.openURL(url);
    this.setState({risk: 'moderate'});
  };

  textWhatsApp = async () => {
    if (!this.state.patientPhoneNumber) {
      return;
    }
    const country_code = await getCountryCode();

    const url =
      'whatsapp://send?phone=' +
      this.state.patientPhoneCode.split('+')[1] +
      this.state.patientPhoneNumber;
    Linking.openURL(url);
    this.setState({risk: 'low'});
  };

  heAlphaCall = async () => {
    const {selected_patient} = this.state;

    if (selected_patient?.virtual_clinic_branch) {
      await AsyncStorage.setItem('virtual_clinic_flag', 'true');
      await AsyncStorage.setItem(
        'virtual_clinic_branch',
        selected_patient?.virtual_clinic_branch,
      );
    } else {
      await AsyncStorage.setItem('virtual_clinic_flag', 'false');
    }

    await AsyncStorage.setItem(
      'twilioEncid',
      this.state.healphaCallEncID + '_' + this.state.healphaCallEncVerNo,
    );
    await AsyncStorage.setItem('twilioPerHlpid', this.state.healphaCallHlpID);
    await AsyncStorage.setItem('twilioPerName', this.state.healphaCallName);
    await AsyncStorage.setItem('fromPage', 'true');

    this.setState(
      {
        call: false,
      },
      () => this.props.TwilioConnection(true),
    );
  };

  renderCallModal() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.call}
        backdropOpacity={0.5}
        style={styles.modalPaddingStyles}>
        <View style={[styles.callModal]}>
          <View style={styles.callModalHeader}>
            <Text
            testID="selectBelowOptionsText"
            accessibilityLabel="selectBelowOptionsText">{t('COMMON.SELECT_BELOW_OPTIONS')}</Text>
            <TouchableOpacity
              style={styles.closeOption}
              onPress={() => this.toggleCallModal()}>
              <Image
                source={Close}
                style={[styles.closeIconStyles, styles.callIcons]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.callModalContent}>
            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.callPhone()}
              testID="callTouch"
              accessibilityLabel="callTouch">
              <Image
               testID="callImage"
               accessibilityLabel="callImage"
                source={Call}
                style={[styles.callOptionStyles, styles.callIcons]}
              />
              <Text
               testID="callText"
               accessibilityLabel="callText"
               >{t('COMMON.PHONE_CALL')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.textWhatsApp()}
              testID="whatsappTouch"
              accessibilityLabel="whatsappTouch">
              <Image
              testID="whatsappImage"
              accessibilityLabel="whatsappImage"
                source={WhatsApp}
                style={[styles.callOptionStyles, styles.callIcons]}
              />
              <Text
              testID="whatsappText"
              accessibilityLabel="whatsappText">{t('COMMON.WHATSAPP')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.heAlphaCall()}>
              <Image
              testID="healphaImage"
              accessibilityLabel="healphaImage"
                source={heAlpha}
                style={[styles.callOptionStyles, styles.callIcons]}
              />
              <Text
              testID="webrtcText"
              accessibilityLabel="webrtcText">{t('COMMON.WEBRTC')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  closeModal() {
    this.setState({
      patientCommentText: '',
      closeModal: false,
      patientComment: '',
    });
  }

  setPatientComment(key, text) {
    let patientCommentText = this.state.patientCommentText;
    patientCommentText = patientCommentText + text;
    this.setState({
      patientComment: key,
      patientCommentText: patientCommentText,
    });
  }

  renderCheckBoxes(key, text, borderBottomWidth) {
    return (
      <View
        style={[
          styles.checkBoxView,
          styles.preDefinedCommentView,
          {borderBottomWidth: borderBottomWidth},
        ]}>
        <TouchableOpacity
          onPress={() => this.setPatientComment(key, text)}
          style={styles.touchableArea}
          testID={text+"touch"}
          accessibilityLabel={text+"touch"}>
          <Text style={styles.fontSize14}
          testID={text+"text"}
          accessibilityLabel={text+"text"}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  patientCloseNoAction() {
    this.closeModal();
  }

  patientCloseYesAction(t) {
    if (this.state.patientCommentText !== '') {
      this.setState({
        isLoading: true,
      });
      this.hideDialog(true);
    } else {
      Toast.show({
        text: t('CLOSE_PATIENT.ADD_COMMENT_MESSAGE'),
        type: 'warning',
        duration: 5000,
        position: 'top',
      });
    }
  }

  handleText(text) {
    if (text === '') {
      this.setState({
        patientComment: '',
        patientCommentText: text,
      });
    } else {
      this.setState({
        patientCommentText: text,
      });
    }
  }

  renderClosePatientModal() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.closeModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeModal()}
        style={styles.modalPaddingStyles}>
        <View style={[styles.closeModal, {height: this.state.modalHeight}]}>
          {/* title and close button */}
          <View style={styles.headerView}>
            <Text style={styles.headerText}
            testID="titleText"
            accessibilityLabel="titleText">{t('CLOSE_PATIENT.TITLE')}</Text>
            <View style={styles.closeView}>
              <TouchableOpacity onPress={() => this.closeModal()}
              testID="closeTouch"
              accessibilityLabel="closeTouch">
                <Image source={Close} style={[styles.closeImage]} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* title and close button end*/}
          {/* default comment check boxes and input*/}
          <View style={styles.infoTextView}>
            <Text style={styles.infoText}
            testID="informationText"
            accessibilityLabel="informationText">{t('CLOSE_PATIENT.INFO_TEXT')}</Text>
          </View>

          <View style={styles.commentsView}>
            {this.renderCheckBoxes(
              'patient_good',
              t('CLOSE_PATIENT.PATIENT_GOOD'),
              1,
              "patientGoodText"
            )}
            {this.renderCheckBoxes(
              'patient_not_continue',
              t('CLOSE_PATIENT.PATIENT_NOT_CONTINUE'),
              1,
              "patientNotContinueText"
            )}
            {this.renderCheckBoxes(
              'patient_serious',
              t('CLOSE_PATIENT.PATIENT_SERIOUS'),
              1,
              "patientSeriousText"
            )}
            {this.renderCheckBoxes(
              'patient_not_reachable',
              t('CLOSE_PATIENT.PATIENT_NOT_REACHABLE'),
              1,
              "patientNotReachableText"
            )}
            {this.renderCheckBoxes(
              'doctor_not_available',
              t('CLOSE_PATIENT.DOCTOR_NOT_AVAILABLE'),
              0,
              "doctorNotAvailableText"
            )}
          </View>

          <View style={styles.infoTextView}>
            <Text style={styles.infoText}
            testID="addAdditionalCommentText"
            accessibilityLabel="addAdditionalCommentText">
              {t('CLOSE_PATIENT.ADD_ADDITIONAL_COMMENT')}
            </Text>
            <TextInput
            testID="commentTextInput"
            accessibilityLabel="commentTextInput"
              multiline={true}
              style={styles.textInputStyles}
              defaultValue={this.state.patientCommentText}
              onChangeText={(text) => this.handleText(text)}></TextInput>
          </View>
          {/* action view */}
          <View style={styles.actionView}>
            <TouchableOpacity
              style={styles.noActionButton}
              onPress={() => this.patientCloseNoAction()}
              testID="noTouch"
                accessibilityLabel="noTouch">
              <Text style={styles.infoText}
              testID="noText"
              accessibilityLabel="noText">{t('CLOSE_PATIENT.NO')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesActionButton}
              onPress={() => this.patientCloseYesAction(t)}
              testID="yesTouch"
                accessibilityLabel="yesTouch">
              {this.state.isLoading ? (
                <ActivityIndicator color={APP_PRIMARY_COLOR} size="small" />
              ) : (
                <Text style={styles.yesInfoText}
                testID="yesText"
                accessibilityLabel="yesText">{t('CLOSE_PATIENT.YES')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderSearchBar() {
    this.setState({
      searchEnable: true,
    });
  }

  closeSearch() {
    this.setState(
      {
        searchEnable: false,
        search: '',
      },
      () => this.performFilter(),
    );
  }

  renderFilters() {
    this.setState({
      filtersEnable: true,
    });
  }

  renderSearchAndFilters() {
    const {t} = this.props;
    return (
      <View style={styles.searchAndFilterSectionMainView}>
        {/* hide if search id enable */}
        {!this.state.searchEnable && (
          <View style={styles.flexDirection}>
            {/* search section */}
            <Button
              rounded
              androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
              style={styles.searchButtonStyles}
              onPress={() =>
                this.setState({
                  searchEnable: true,
                })
              }
              testID="searchPatientsButton"
              accessibilityLabel="searchPatientsButton">
              <View style={styles.searchAndFilterMainView}>
                <Image
                testID="searchPatientsImage"
                accessibilityLabel="searchPatientsImage"
                  source={SearchPatients}
                  style={styles.searchFilterImageStyles}
                />
                <Text style={styles.searchFilterText}
                testID="searchText"
                accessibilityLabel="searchText">
                  {t('DASHBOARD.SEARCH')}
                </Text>
              </View>
            </Button>

            <Button
              rounded
              androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
              style={styles.filterButtonStyles}
              onPress={() => this.renderFilters()}>
              <View style={styles.searchAndFilterMainView}
                testID="patientsFilterButton"
                accessibilityLabel="patientsFilterButton">
                <Image
                testID="patientsImage"
                accessibilityLabel="patientsImage"
                  source={FilterPatients}
                  style={styles.searchFilterImageStyles}
                />
                <Text style={styles.searchFilterText}
                testID="filterText"
                accessibilityLabel="filterText">
                  {t('DASHBOARD.FILTER')}
                </Text>
              </View>
            </Button>
          </View>
        )}

        {/* entire section search and close button */}
        {this.state.searchEnable && (
          <View style={styles.searchMainView}>
            <Button
              rounded
              androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
              transparent
              style={[
                styles.backArrowTouchablePadding,
                styles.backArrowButtonStyles,
              ]}
              onPress={() => this.closeSearch()}>
              <Image source={BackArrow} style={styles.backArrowStyles} 
              testID="backArrowImage"
              accessibilityLabel="backArrowImage"/>
            </Button>
            <TextInput
            testID="searchPatientsTextInput"
            accessibilityLabel="searchPatientsTextInput"
              autoFocus
              style={styles.searchInputStyles}
              placeholder={t('DASHBOARD.SEARCH_PATIENTS')}
              value={this.state.search}
              onChangeText={this.onChangeText}
            />
          </View>
        )}
      </View>
    );
  }

  closeDoctorModal() {
    this.setState({
      filtersEnable: false,
    });
  }

  applyPatientFilter(value) {
    this.onFilterChange(value);
  }
  renderPatientFilters() {
    const {t} = this.props;
    let patientFilterArray = [
      {
        label: t('COVID_MONITORING.PENDING_FIRST_REVIEW'),
        value: 'pending_first_review',
        key: 'pending_first_review',
      },
      {
        label: t('COVID_MONITORING.PENDING_SECOND_REVIEW'),
        value: 'pending_second_review',
        key: 'pending_second_review',
      },
      {
        label: t('COVID_MONITORING.PENDING_NURSE_REVIEW'),
        value: 'pending_nurse_review',
        key: 'pending_nurse_review',
      },
      {
        label: t('COVID_MONITORING.PENDING_DIETICIAN_REVIEW'),
        value: 'pending_dietician_review',
        key: 'pending_dietician_review',
      },
      {
        label: t('COVID_MONITORING.PENDING_PHYSIOTHERAPY_REVIEW'),
        value: 'pending_physiotherapy_review',
        key: 'pending_physiotherapy_review',
      },
    ];
    if (patientFilterArray.length) {
      return patientFilterArray.map((item, index) => (
        <View style={styles.doctorViewStyles} key={index}>
          <TouchableOpacity
            style={styles.filterTouchable}
            onPress={() => this.applyPatientFilter(item.value)}
            testID={item.label+"checkboxTouch"}
            accessibilityLabel={item.label+"checkboxTouch"}>
            <CheckBox
            testID={item.label+"checkbox"}
            accessibilityLabel={item.label+"checkbox"}
              style={{marginRight: 20}}
              checked={this.state.patientFilter === item.value}
            />
            <Text
            testID={item.label+"text"}
            accessibilityLabel={item.label+"text"}>{`${item.label}`}</Text>
          </TouchableOpacity>
        </View>
      ));
    } else {
      return (
        <View style={styles.doctorViewStyles}
        testID="noDataText"
        accessibilityLabel="noDataText">
          <Text>{t('CLOSE_PATIENT.NO_DATA')}</Text>
        </View>
      );
    }
  }

  renderFiltersModal() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.filtersEnable}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeDoctorModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.filterModal}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}
            testID="patientFilterText"
            accessibilityLabel="patientFilterText">
              {t('DASHBOARD.PATIENT_FILTER')}
            </Text>
            <View style={styles.closeView}>
              <Button
                rounded
                androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                transparent
                style={styles.clearAllButton}
                onPress={() => this.applyPatientFilter(null)}
                testID="clearAllButton"
                accessibilityLabel="clearAllButton">
                <Text style={styles.clearTextStyles}
                testID="clearAllText"
                accessibilityLabel="clearAllText">
                  {t('DASHBOARD.CLEAR_ALL')}
                </Text>
              </Button>
              <Button
                rounded
                androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                transparent
                style={styles.closeButton}
                onPress={() => this.closeDoctorModal()}
                testID="closeButton"
                accessibilityLabel="closeButton">
                <Image source={Close} style={styles.closeImage} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </Button>
            </View>
          </View>

          {/* render doctor list */}
          <ScrollView>{this.renderPatientFilters()}</ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        {this.renderSearchAndFilters()}
        {this.renderHeader()}
        {(this.props.isLoading || this.state.loader) &&
          this.renderActivityIndicator()}
        {this.renderPatientList()}

        {this.renderConfirmDialog()}

        {this.state.showPatientConsentModal && this.renderPatientConsentModal()}
        {this.renderCallModal()}
        {this.renderClosePatientModal()}

        {this.state.filtersEnable && this.renderFiltersModal()}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    covidMonitorList:
      state.covidMonitorList.response?.data?.covid_monitor_list || [],
    isLoading: state.covidMonitorList.loading,
    closeEncounterStatusData: state.closeEncounterStatusData.response,
    reopenEncounterStatusData: state.reopenEncounterStatusData.response,
  };
};

export default withTranslation()(
  connect(mapStateToProps, {
    getCovidMonitorList,
    closeEncounterStatus,
    reopenEncounterStatus,
    TwilioConnection,
  })(CovidMonitoringPatientList),
);
