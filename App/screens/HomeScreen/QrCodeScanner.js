import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {
  Container,
  //   Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Card,
  CardItem,
} from 'native-base';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from 'i18next';
import getBaseUrl from '../../config/Config';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from 'react-navigation';
import {RNCamera} from 'react-native-camera';
import {
  getAppointmnetsLogs,
  getOptions,
  getPatient,
  unavailablePatient,
} from '../../redux/actions/appointment_action';
import axios from 'axios';
// const Realm = require('realm');
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  SHOW_MY_QR_COLOR,
} from '../../themes/variable';
import HomeScreen from '../app/homescreen/HomeScreen';
import {
  getAppointmentsList,
  searchPatient,
} from '../../redux/actions/appointment_action';
import {BOOKAPPOINTMENT, PATIENTCARD, REVIEW} from '../app/common/Constants';
import {connect} from 'react-redux';
import ApiCall from '../../services/ApiCall';
// let realm;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
class QrCodeScanner extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    let dat_val = new Date();
    this.state = {
      today_date: moment(dat_val).format('YYYY-MM-DD'),
      doc_price: [],
      doc_price1: [],
      apptype: '',
      doctorname: '',
      doctorid: '',
      branchid: '',
      start_time: '',
      end_time: '',
      app_date: '',
      mail: '',
      isFocused: true,
      flashMode: RNCamera.Constants.FlashMode.off,
      branch_id: this.props.navigation.state.params?.branch_id,
      branch_name: this.props.navigation.state.params?.branch_name,
      aasha: this.props.navigation.state.params?.aasha,
    };
  }

  componentDidMount = async () => {};

  onSuccess = async e => {
    try {
      let object_current_date;
      let object_current_payment;
      const token = await AsyncStorage.getItem('jwt_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let doctorId = await AsyncStorage.getItem('doctorid');
      let branchId = await AsyncStorage.getItem('branch_id');
      const variables = {
        doctor_id: doctorId,
        branch_id: branchId,
        date: moment(new Date()).format('YYYY-MM-DD'),
        appointment_checked: '',
        search_text: '',
        limit: '',
        offset: '',
      };
      let booked_status_object;
      const response_appointments = await getAppointmentsList(variables);
      if (e?.data && response_appointments?.appointments.length > 0) {
        response_appointments?.appointments.map(async item => {
          if (
            item?.appointment?.person_details?.hlpid.toString() ==
            e?.data.toString()
          ) {
            if (item?.appointment?.appointment_status == 'Booked') {
              booked_status_object = item;
            } else if (item?.appointment?.appointment_status != 'Cancelled') {
              object_current_payment = item;
            }
            return;
          }
        });
      }
      //if appointmnet in booked state case 3
      if (booked_status_object) {
        if (global.standalone == '1' || global.standalone == 1) {
          Alert.alert(``, i18n.t('COMMON.UPDATE_BILL'), [
            {
              text: 'Yes',
              onPress: () =>
                this.props.navigation.navigate('PayBill', {
                  appointmentId: booked_status_object?.appointment?.id,
                }),
            },
            {
              text: 'Start Consultation',
              // onPress: () =>
              //   this.props.navigation.navigate(PATIENTCARD, {
              //     virtualBranch:
              //       booked_status_object?.appointment?.virtual_clinic_branch,
              //     appointmentId: booked_status_object?.appointment?.id,
              //     edit:
              //       booked_status_object?.appointment?.appointment_status.toLowerCase() ===
              //       REVIEW
              //         ? true
              //         : false,
              //   }),
              onPress: () =>
                this.props.navigation.navigate('HomeScreen', {
                  qr_code_hlp_id: e?.data,
                  branch_id: this.state.branch_id,
                  branch_name: this.state.branch_name,
                  aasha: this.state.aasha,
                  type: 'qr_code',
                  qr_book_consult: true,
                  appointment_id_qr: booked_status_object?.appointment?.id,
                }),
            },
            {
              text: 'No',
            },
          ]);
        } else {
          Alert.alert(``, i18n.t('COMMON.UPDATE_BILL'), [
            {
              text: 'front desk',
            },
          ]);
        }
      }
      //Payment done case 2
      else if (object_current_payment) {
        if (
          object_current_payment?.appointment?.appointment_status ==
            'Confirm' ||
          object_current_payment?.appointment?.appointment_status == 'Checkedin'
        ) {
          if (global.standalone == '1' || global.standalone == 1) {
            const search_patient = await searchPatient(
              object_current_payment?.appointment?.person_details?.full_name,
            );
            let patient_data;
            search_patient?.data?.persons.map(patient => {
              if (
                patient?.hlpid.toString() ==
                object_current_payment?.appointment?.person_details?.hlpid.toString()
              ) {
                patient_data = patient;
              }
            });

            Alert.alert(i18n.t('COMMON.START_CONSULT'), ` `, [
              {
                text: 'Yes',
                onPress: () =>
                  this.props.navigation.navigate(PATIENTCARD, {
                    virtualBranch:
                      object_current_payment?.appointment
                        ?.virtual_clinic_branch,
                    appointmentId: object_current_payment?.appointment?.id,
                    edit:
                      object_current_payment?.appointment?.appointment_status.toLowerCase() ===
                      REVIEW
                        ? true
                        : false,
                    appointment_id_qr: object_current_payment?.appointment?.id,
                    modaltemp:
                      object_current_payment?.appointment?.appointment_status ==
                      'Checkedin'
                        ? true
                        : false,
                    navigation: this.props.navigation,
                  }),
              },
              {text:'No'}
            ]);
          } else {
            Alert.alert(i18n.t('COMMON.START_CONSULT'), ``, [
              {
                text: 'Ok',
                onPress: () =>
                  this.props.navigation.navigate(PATIENTCARD, {
                    virtualBranch:
                      object_current_payment?.appointment
                        ?.virtual_clinic_branch,
                    appointmentId: object_current_payment?.appointment?.id,
                    edit:
                      object_current_payment?.appointment?.appointment_status.toLowerCase() ===
                      REVIEW
                        ? true
                        : false,
                    appointment_id_qr: object_current_payment?.appointment?.id,
                    modaltemp:
                      object_current_payment?.appointment?.appointment_status ==
                      'Checkedin'
                        ? true
                        : false,
                    navigation: this.props.navigation,
                  }),
              },
            ]);
          }
        } else if (
          object_current_payment?.appointment?.appointment_status ==
          'Consulting'
        ) {
          const payload = {
            branch_id: object_current_payment?.appointment?.branch_id,
            id: object_current_payment?.appointment?.id,
          };
          let body = {branch_id: payload.branch_id};
          // dispatch(fetchLoadingPatient());
          let url =
            getBaseUrl() +
            `v1/appointment/${payload.id}?branch_id=${payload.branch_id}`;
          const template_id = await ApiCall.get(url, body);
          const convert_template_id = parseInt(
            template_id?.data?.person_appointment_details?.template_id,
          );
          Alert.alert(i18n.t('COMMON.CONSULT'), ` `, [
            {
              text: 'Yes',
              onPress: () =>
                this.props.navigation.navigate(PATIENTCARD, {
                  virtualBranch:
                    object_current_payment?.appointment?.virtual_clinic_branch,
                  appointmentId: object_current_payment?.appointment?.id,
                  edit:
                    object_current_payment?.appointment?.appointment_status.toLowerCase() ===
                    REVIEW
                      ? true
                      : false,
                  appointment_id_qr: object_current_payment?.appointment?.id,
                  modaltemp:
                    object_current_payment?.appointment?.is_online ==
                    true
                      ? false
                      : '',
                  navigation: this.props.navigation,
                  Template_exist:
                    object_current_payment?.appointment?.is_online ==
                    true
                      ? false
                      : true,
                  convert_template_id: convert_template_id,
                }),
            },
            {text:'No'}
          ]);
        } else {
          Alert.alert(
            `${
              object_current_payment?.appointment?.person_details?.full_name
            } ${i18n.t('COMMON.APP_TODAY')}${
              object_current_payment?.appointment?.date_start
            }`,
            ``,
            [
              {
                text: 'Ok',
              },
            ],
          );
        }
      }
      //No appointment (case 1)
      else {
        if (global.standalone == '1' || global.standalone == 1) {
          const search_patient = await searchPatient(e?.data);
          let patient_data;
          search_patient?.data?.persons.map(patient => {
            if (patient?.hlpid.toString() == e?.data.toString()) {
              patient_data = patient;
            }
          });
          Alert.alert(i18n.t('COMMON.BOOK_START_CONSULT'), ``, [
            {
              text: 'Yes',
              onPress: () =>
                this.props.navigation.navigate(BOOKAPPOINTMENT, {
                  branchId: this.state.branch_id,
                  slot_timing: global.slot_timing,
                  doctorId: doctorId,
                  personDetails: patient_data,
                }),
            },
            {
              text: 'No',
            },
          ]);
        } else if (global.standalone == '0' || global.standalone == 0) {
          Alert.alert(i18n.t('COMMON.BOOK_START_CONSULT'), ``, [
            {
              text: 'front desk',
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
      if (error) {
        Alert.alert('', i18n.t('QRSCAN.ALERT'), [
          {
            text: i18n.t('QRSCAN.YES'),
            onPress: () => {
              this.setState({isFocused: true});
            },
          },
        ]);
      } else {
        Alert.alert('', i18n.t('COMMON.APP_NOT_THERE'), [
          {
            text: 'OK',
            onPress: () => this.props.navigation.navigate('Dashboard'),
          },
        ]);
      }
    }
  };

  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  onDidFocus = payload => {
    this.setState({isFocused: true});
  };

  onDidBlur = payload => {
    this.setState({isFocused: false});
  };

  render() {
    const {isFocused} = this.state;
    return (
      <View style={{flex: 1}}>
        <NavigationEvents
          onDidFocus={this.onDidFocus}
          onDidBlur={this.onDidBlur}
        />
        {isFocused && (
          <QRCodeScanner
            flashMode={this.state.flashMode}
            showMarker
            reactivate={true}
            reactivateTimeout={9000}
            onRead={this.onSuccess.bind(this)}
            cameraStyle={{height: SCREEN_HEIGHT}}
            customMarker={
              <View style={styles.rectangleContainer}>
                <View style={styles.topOverlay}>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {i18n.t('QRSCAN.SCAN')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {i18n.t('QRSCAN.CHECK')}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={styles.leftAndRightOverlay} />

                  <View style={styles.rectangle}>
                    <Icon
                      name="ios-qr-scanner"
                      size={SCREEN_WIDTH * 0.73}
                      color={iconScanColor}
                    />
                    <Animatable.View
                      style={styles.scanBar}
                      direction="alternate-reverse"
                      iterationCount="infinite"
                      duration={1700}
                      easing="linear"
                      animation={this.makeSlideOutTranslation(
                        'translateY',
                        SCREEN_WIDTH * -0.54,
                      )}
                    />
                  </View>

                  <View style={styles.leftAndRightOverlay} />
                </View>

                {/* <View style={styles.qrCodeView}>
                  <TouchableOpacity
                    style={styles.qrCodeTouchable}
                    onPress={() =>
                      this.props.navigation.navigate('AppointmentCancel')
                    }>
                    <Image
                      source={require('../../assets/images/show_my_qr.png')}
                      style={styles.qrCodeIcon}
                    />
                    <Text style={styles.qrCodeText}>
                      {i18n.t('QRSCAN.MYQR')}
                    </Text>
                  </TouchableOpacity>
                </View> */}

                <View style={styles.bottomOverlay}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {i18n.t('QRSCAN.TECH')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {i18n.t('QRSCAN.CONTACT')} : care@healpha.com,+91
                    7207928363.
                  </Text>
                </View>
                {/* <FlashMessage position="top" ref={ref => this.welcomeAlert = ref}/> */}
              </View>
            }
          />
        )}
      </View>
    );
  }
}

export default QrCodeScanner;
// const mapDispatchToProps = dispatch => {
//   return {
//     // fetchMicroTemplatesuccess: data =>
//     //   dispatch(fetchMicroTemplatesuccess(data)),
//     // TwilioConnection: data => dispatch(TwilioConnection(data)),
//     // storeTemplateId: data => dispatch(storeTemplateId(data)),
//     getPatient: data => dispatch(getPatient(data)),
//   };
// };

// export default connect(
//   mapDispatchToProps,
// )(QrCodeScanner);

const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = 'white';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = 'white';

const iconScanColor = 'white';

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    // paddingBottom: SCREEN_WIDTH * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },
  qrCodeView: {
    margin: 30,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    backgroundColor: SHOW_MY_QR_COLOR,
  },
  qrCodeTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: '500',
    color: DEFAULT_WHITE_COLOR,
  },
};
