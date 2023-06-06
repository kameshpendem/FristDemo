import React, {Component} from 'react';
import {
  View,
  Text,
  Linking,
  Platform,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Container, Tab, Tabs, DefaultTabBar, Icon, Toast} from 'native-base';
import Popover from 'react-native-popover-view';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {
  getCovidMonitorPatient,
  closeEncounterStatus,
  reopenEncounterStatus,
} from '../../../redux/actions/covidmonitoring_action';
import {TwilioConnection} from '../../../redux/actions/TwilioActions';
import CovidMonitoringHistoryTab from './Tabs/CovidMonitoringHistoryTab';
// import CovidMonitoringRecordVitalsTab from './Tabs/CovidMonitoringRecordVitalsTab';
import CovidMonitoringInitialAssessment from './IntialsAssessment/CovidMonitoringInitialAssessment';
import CovidMonitoringReviewTab from './Tabs/CovidMonitoringReviewTab';
import ConfirmDialog from '../Common/ConfirmDialog';
import styles from './CovidMonitoringPatientViewStyle';
import UploadFileModal from '../Common/UploadFileModal';
import PatientConsentModal from '../Common/PatientConsentModal';
import {calculateAge} from './Utils/Utils';
import AsyncStorage from '@react-native-community/async-storage';

// images
import Close from '../../../assets/images/close.png';
import Call from '../../../assets/images/call.png';
import WhatsApp from '../../../assets/images/whatsapp.png';
import heAlpha from '../../../assets/images/heAlpha.png';
import getBaseUrl, {
  getDevelopmentUrl,
  getEnvironmentObject,
} from '../../../config/Config';
import {getCountryCode} from '../../../utils/CountryCode';
import i18n from '../../../../i18n';

class CovidMonitoringPatientView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: 0,
      activePage: 0,
      token: '',
      doctor_id: '',
      doctor_name: '',
      selected_doctor_id: '',
      status: '',
      patient: {},
      risk: 'high',
      visible: false,
      dialog: false,
      action: null,
      role: 'doctor',
      show: false,
      confirmDialogData: {},
      touchableRef: null,
      call: false,
      showBackAlert: true,
      showTabs: false,
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

    this.startTelepathy = this.startTelepathy.bind(this);
    this.callPhone = this.callPhone.bind(this);
    this.textWhatsapp = this.textWhatsapp.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.toggleUploadFileModal = this.toggleUploadFileModal.bind(this);
    this.handleBackPress = this.handleBackPress.bind(this);
    this.toggleCallModal = this.toggleCallModal.bind(this);
    this.updateShowBackAlert = this.updateShowBackAlert.bind(this);
    this.hidePatientConsentModal = this.hidePatientConsentModal.bind(this);
    this.updateActiveTab = this.updateActiveTab.bind(this);
  }

  componentDidMount() {
    this.init();
    this.props.navigation.setParams({
      handleBackPress: this.handleBackPress,
      togglePopover: this.togglePopover,
      toggleUploadFileModal: this.toggleUploadFileModal,
      toggleCallModal: this.toggleCallModal,
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress() {
    const {t} = this.props;

    if (this.state.status !== 'closed' && this.state.showBackAlert) {
      Alert.alert(
        i18n.t('PATIENTS.NOT_REVIEW'),
        i18n.t('PATIENTS.NOT_REVIEW'),
        [
          {
            text: i18n.t('PATIENTS.BACK'),
            onPress: () => {
              this.props.navigation.goBack(null);
            },
          },
          {
            text: i18n.t('COMMON.OK'),
            onPress: () => {
              this.setState({activePage: 2});
            },
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  }

  init = async () => {
    console.log("twilioview")
    // {global.twilioconnected && global.twilioviewpdf?
    //   Alert.alert(
    //     'Disconnecting the Healpha Call with',
    //     global.twiliopatienname,
    //     [
    //       {text: 'Yes', onPress: () => {
    //         global.twilioviewpdf= false
    //         global.twilioconnected= false
    //         DeviceEventEmitter.emit('eventTwilioDisconnect', { data: 'disconnect'});
    //       }},
    //     ],
    //     {cancelable: false},
    //   ):null}
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
      doctor_id,
      doctor_name,
      selected_doctor_id,
      status,
      patient,
      initialPage,
    } = params;

    const role = await AsyncStorage.getItem('role');

    this.setState(
      {
        token,
        doctor_id,
        doctor_name,
        selected_doctor_id,
        status,
        patient,
        initialPage,
        activePage: initialPage,
        role,
        showTabs: true,
      },
      () => this.getCovidMonitorPatient(),
    );
  };

  getCovidMonitorPatient = async () => {
    const payload = {
      nh_id: this.state.doctor_id,
      token: this.state.token,
      hlp_id: this.state.patient.hlpid,
    };
    await this.props.getCovidMonitorPatient(payload);
  };

  closeEncounterStatus = async () => {
    const payload = {
      nh_id: this.state.doctor_id,
      token: this.state.token,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      role_type: this.state.role,
      doctor_name: this.state.doctor_name,
    };
    await this.props.closeEncounterStatus(payload);
    this.setState({dialog: false, action: null});
    Toast.show({
      text: this.props.closeEncounterStatusData?.message,
      type: 'success',
      duration: 5000,
    });
  };

  reopenEncounterStatus = async () => {
    const payload = {
      nh_id: this.state.doctor_id,
      token: this.state.token,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
      role_type: this.state.role,
      doctor_name: this.state.doctor_name,
    };
    await this.props.reopenEncounterStatus(payload);
    this.setState({dialog: false, action: null});
    Toast.show({
      text: this.props.reopenEncounterStatusData?.message,
      type: 'success',
      duration: 5000,
    });
  };

  startTelepathy() {
    this.setState({risk: 'high'});
  }

  callPhone = async () => {
    const patient = this.state.patient;
    const {t} = this.props;

    if (!patient?.phone_no) {
      Toast.show({
        text: t('PROFILE.PHONE_NUMBER'),
        type: 'warning',
        duration: 3000,
        position: 'top',
      });
      return;
    }
    let country_code = await getCountryCode();
    let url = '';
    if (Platform.OS === 'android') {
      url = 'tel:' + patient?.phone_code + patient?.phone_no;
    } else {
      url = 'telprompt:' + patient?.phone_code + patient?.phone_no;
    }
    Linking.openURL(url);
    this.setState({risk: 'moderate'});
  };

  textWhatsapp = async () => {
    const patient = this.state.patient;
    const {t} = this.props;
    if (!patient?.phone_no) {
      Toast.show({
        text: t('PROFILE.PHONE_NUMBER'),
        type: 'warning',
        duration: 3000,
        position: 'top',
      });
      return;
    }
    let country_code = await getCountryCode();

    const url = 'whatsapp://send?phone=' + this.state.patient?.phone_code + patient?.phone_no;
    
    Linking.openURL(url);
    this.setState({risk: 'low'});
  };

  heAlphaCall = async() => {
    const patient = this.state.patient;
    await AsyncStorage.setItem('twilioEncid', patient.enc_id+'_'+patient.enc_version);
    await AsyncStorage.setItem('twilioPerHlpid', patient.hlpid);
    await AsyncStorage.setItem('twilioPerName', patient.patient_name);
    await AsyncStorage.setItem('fromPage', "true");

    this.setState(
      {
        call: false,
      },
      () => this.props.TwilioConnection(true),
    );
  };

  onChangeTab({i, from, ref}) {
    if (i === this.state.activePage) {
      return;
    }
    this.setState({activePage: i});
  }

  togglePopover(touchableRef) {
    this.setState({touchableRef});
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  }

  toggleUploadFileModal() {
    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  }

  toggleCallModal() {
    this.setState((prevState) => {
      let newState = {...prevState, call: !prevState.call};
      return newState;
    });
  }

  updateShowBackAlert(value) {
    this.setState({showBackAlert: value});
  }

  updateTab(value) {
    if (value === 0) {
      this.historyTab.updateLoader();
    }
    setTimeout(() => {
      if (value === 0) {
        this.historyTab.init();
      } else if (value === 1) {
        this.recordVitalsTab.init();
      } else if (value === 2) {
        this.reviewTab.init();
      }
    }, 1000);
  }
  updateActiveTab(value) {
    this.setState({activePage: value}, () => this.updateTab(value));
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
    }
    this.setState({showPatientConsentModal: false});
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
        });
      } else {
        this.showDialog(action);
      }
    }
  }

  onActionClick(action) {
    const patient = this.state.patient;

    if (!this.checkValidations(action, patient)) {
      return;
    }

    this.togglePopover();

    if (action === this.action.patient_consent) {
      this.performPatientConsentAction(action, patient);
    } else if (action === this.action.initial_assessment) {
      this.performInitialAssessmentAction(action, patient);
    } else if (action === this.action.prescription) {
      this.performPrescriptionAction(action, patient);
    } else if (action === this.action.preview && patient.preview_file_path) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${patient.preview_file_path}`,
      });
    } else if (action === 'report' && patient.report_file_path) {
      this.props.navigation.navigate('ViewPdf', {
        link: `${getDevelopmentUrl()}/${patient.report_file_path}`,
      });
    } else if (action === this.action.close) {
      this.showDialog(action);
    } else if (action === this.action.reopen) {
      this.showDialog(action);
    }
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

    this.setState({dialog: true, action, confirmDialogData});
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
        dialog: false,
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
      dialog: false,
      action: null,
      confirmDialogData: {},
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
    });
  }

  navigateToTimeline() {
    this.props.navigation.navigate('OldPatient', {
      docid: this.state.doctor_id,
      branch_id: this.state.branch_id,
      open_consult_popup: true,
      schedule_date: this.state.patient.schedule_date,
      hlp_id: this.state.patient.hlpid,
      enc_id: this.state.patient.enc_id,
    });
  }

  sendNotification = async (content) => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    console.log('poiuy', deviceToken);
    const {t} = this.props,
      url = getBaseUrl() + 'notify_patient/',
      payload = JSON.stringify({
        hlp: this.state.patient.hlpid,
        doc: this.state.selected_doctor_id,
        token: this.state.token,
        node_token: deviceToken,
        content:content,
      });
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

  renderCallModal() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.call}
        backdropOpacity={0.5}
        style={styles.modalMargins}>
        <View style={styles.callModal}>
          <View style={styles.callModalHeader}>
            <Text
            testID="selectBelowOptionsText"
            accessibilityLabel="selectBelowOptionsText">{t('COMMON.SELECT_BELOW_OPTIONS')}</Text>
            <TouchableOpacity
            testID="callTouch"
            accessibilityLabel="callTouch"
              style={styles.closeOption}
              onPress={() => this.toggleCallModal()}>
              <Image
              testID="callImage"
              accessibilityLabel="callImage"
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
               accessibilityLabel="callText">{t('COMMON.PHONE_CALL')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callOption}
              onPress={() => this.textWhatsapp()}
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
              onPress={() => this.heAlphaCall()}
              testID="webrtcTouch"
              accessibilityLabel="webrtcTouch">
              <Image
               testID="webrtcImage"
               accessibilityLabel="webrtcImage"
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

  renderUploadFileModal() {
    const {t} = this.props;
    return (
      <UploadFileModal
        visible={this.state.show}
        onDismiss={this.toggleUploadFileModal}
        title={t('COMMON.UPLOADED_FILES')}
        upload={false}
        doctor_id={this.state.doctor_id}
        hlp_id={this.state.patient.hlpid}
        enc_id={this.state.patient.enc_id}
        navigation={this.props.navigation}
      />
    );
  }

  renderPopoverMenu() {
    const {t} = this.props;
    return (
      <View style={styles.popoverMenuView}>
        <Popover
          isVisible={this.state.visible}
          onRequestClose={this.togglePopover}
          from={this.state.touchableRef}>
          <View style={styles.popoverContentView}>
            <Text
              style={styles.popoverMenuItem}
              onPress={() => this.onActionClick(this.action.patient_consent)}
              testID="patientConcentText"
              accessibilityLabel="patientConcentText">
              {t('COVID_MONITORING.PATIENT_CONSENT')}
            </Text>
            <Text
             testID="initialAssessmentText"
             accessibilityLabel="initialAssessmentText"
              style={styles.popoverMenuItem}
              onPress={() =>
                this.onActionClick(this.action.initial_assessment)
              }>
              {t('COVID_MONITORING.INITIAL_ASSESSMENT')}
            </Text>
            <Text
             testID="prescriptionText"
             accessibilityLabel="prescriptionText"
              style={styles.popoverMenuItem}
              onPress={() => this.onActionClick(this.action.prescription)}>
              {t('COVID_MONITORING.PRESCRIPTION')}
            </Text>
            {this.state.status !== 'closed' && (
              <Text
              testID="previewText"
              accessibilityLabel="previewText"
                style={styles.popoverMenuItem}
                onPress={() => this.onActionClick(this.action.preview)}>
                {t('COVID_MONITORING.PREVIEW')}
              </Text>
            )}
            {this.state.status === 'closed' && (
              <Text
              testID="reportText"
              accessibilityLabel="reportText"
                style={styles.popoverMenuItem}
                onPress={() => this.onActionClick(this.action.report)}>
                {t('COVID_MONITORING.REPORT')}
              </Text>
            )}
            {this.state.role !== 'physiotherapist' &&
              this.state.role !== 'dietician' && (
                <Text
                  style={styles.popoverMenuItem}
                  onPress={() =>
                    this.onActionClick(
                      this.state.status === 'closed'
                        ? this.action.reopen
                        : this.action.close,
                    )
                  }>
                  {this.state.status === 'closed'
                    ? t('COVID_MONITORING.REOPEN_CASE')
                    : t('COVID_MONITORING.CLOSE_CASE')}
                </Text>
              )}
          </View>
        </Popover>
      </View>
    );
  }

  navigateToProfile() {
    this.props.navigation.navigate('Person_Profile', {
      hlpid: this.state.patient.hlpid,
    });
  }

  renderDetails() {
    const {t} = this.props;
    return (
      <TouchableOpacity onPress={() => this.navigateToProfile()}>
        <View style={styles.detailsView}>
          <View style={styles.detailsLeftView}>
            <View style={styles.eachDetailView}>
              <Text style={styles.eachDetailLabel}
              testID="nameText"
              accessibilityLabel="nameText">
                {t('COVID_MONITORING.NAME')}
              </Text>
              <Text style={styles.eachDetailValue}>
                {/* {`${this.props.covidMonitorPatient?.first_name || ''} ${
                  this.props.covidMonitorPatient?.last_name || ''
                }`} */}
                {`${this.state.patient?.patient_name || ''} ${
                  this.state.patient?.last_name || ''
                }`}
              </Text>
            </View>
            <View style={styles.eachDetailView}>
              <Text style={styles.eachDetailLabel}
              testID="visitIdText"
              accessibilityLabel="visitIdText">
                {t('COVID_MONITORING.VISIT_ID')}
              </Text>
              <Text style={[styles.eachDetailValue, styles.visitIdValue]}
              testID={this.state.patient?.enc_id+"text"}
              accessibilityLabel={this.state.patient?.enc_id+"text"}>
                {this.state.patient?.enc_id?.split('-')?.[2]}
              </Text>
            </View>
            <View style={styles.eachDetailView}>
              <Text style={styles.eachDetailLabel}
              testID="detailsText"
              accessibilityLabel="detailsText">
                {t('COVID_MONITORING.DETAILS')}
              </Text>
              <Text style={styles.eachDetailValue}
              testID={this.state.patient?.gender+this.state.patient?.dob+"text"}
              accessibilityLabel={this.state.patient?.gender+this.state.patient?.dob+"text"}>
                {this.state.patient?.gender || ''}
                {this.state.patient?.dob && (
                  <Text style={styles.ageValue}
                  testID={ this.state.patient.dob+"text"}
                  accessibilityLabel={ this.state.patient.dob+"text"}>{` / ${calculateAge(
                    this.state.patient.dob,
                  )}`}</Text>
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderEachTab(heading, TabComponent, refId,testID) {
    return (
      <Tab
      testID={testID}
      accessibilityLabel={testID}
        heading={heading}
        tabStyle={styles.tabStyle}
        textStyle={styles.textStyle}
        activeTabStyle={styles.tabStyle}
        activeTextStyle={styles.textStyle}>
        <TabComponent
         testID={testID}
         accessibilityLabel={testID}
          onRef={(ref) => (this[refId] = ref)}
          token={this.state.token}
          status={this.state.status}
          doctor_id={this.state.doctor_id}
          patient={this.state.patient}
          from={'record_vital'}
          navigation={this.props.navigation}
          updateShowBackAlert={this.updateShowBackAlert}
          updateActiveTab={this.updateActiveTab}
        />
      </Tab>
    );
  }

  renderTabBar(props) {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  }

  renderTabs() {
    const {t} = this.props;
    return (
      <Container>
        <Tabs
          initialPage={this.state.initialPage}
          page={this.state.activePage}
          onChangeTab={(e) => {
            this.onChangeTab(e);
          }}
          locked={true}
          renderTabBar={this.renderTabBar.bind(this)}>
          {this.renderEachTab(
            t('COVID_MONITORING.HISTORY'),
            CovidMonitoringHistoryTab,
            'historyTab',
            "historyText"
          )}
          {this.renderEachTab(
            t('COVID_MONITORING.RECORD_VITALS'),
            CovidMonitoringInitialAssessment,
            'recordVitalsTab',
            "recordVitalsText"
          )}
          {this.renderEachTab(
            t('COVID_MONITORING.REVIEW'),
            CovidMonitoringReviewTab,
            'reviewTab',
            "reviewText"
          )}
        </Tabs>
      </Container>
    );
  }

  renderConfirmDialog() {
    const {t} = this.props;
    return (
      <ConfirmDialog
        visible={this.state.dialog}
        onDismiss={this.hideDialog}
        title={t('COVID_MONITORING.CONFIRM_CLOSE_DIALOG_TITLE')}
        content={t('COVID_MONITORING.CONFIRM_CLOSE_DIALOG_CONTENT')}
        noLabel={t('COMMON.CANCEL')}
        yesLabel={t('COMMON.OK')}
      />
    );
  }

  render() {
    return (
      <Container>
        {this.renderDetails()}
        {this.state.showTabs && this.renderTabs()}
        {this.renderConfirmDialog()}
        {this.renderPopoverMenu()}
        {this.state.show && this.renderUploadFileModal()}
        {this.renderPatientConsentModal()}
        {this.renderCallModal()}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    covidMonitorPatient:
      state.covidMonitorPatient.response?.data?.patient_detail,
    closeEncounterStatusData: state.closeEncounterStatusData.response,
    reopenEncounterStatusData: state.reopenEncounterStatusData.response,
  };
};

export default withTranslation()(
  connect(mapStateToProps, {
    getCovidMonitorPatient,
    closeEncounterStatus,
    reopenEncounterStatus,
    TwilioConnection,
  })(CovidMonitoringPatientView),
);
