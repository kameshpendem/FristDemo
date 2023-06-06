import {
  Body,
  Button,
  Card,
  CardItem,
  Left,
  Thumbnail,
  Toast,
} from 'native-base';
import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Divider} from 'react-native-elements';
import {wp} from '../../../themes/Scale';
import {theme} from '../../../themes/Theme';
// import PatientConsentModal from '../Common/PatientConsentModal';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
// import AppLoader from '../Common/AppLoader';
import Loader from '../common/Loader';
import styles from './BookAppointmentStyles';
// import {DoctorCard} from '../../components/appointment/DoctorCard';
import axios from 'axios';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';
import email from '../../../assets/images/appointmentEmail.png';
import phone from '../../../assets/images/mobile.png';
import Name from '../../../assets/images/Patient.png';
import {createAppointment} from '../../../redux/actions/appointment_action';
import {getPaymentCriteria} from '../../../redux/actions/billing_action';
import {capitalize} from '../../../utils/capitalizeFirst';
import {getCountryCode} from '../../../utils/CountryCode';
import FooterButton from '../common/FooterButton';
import Header from '../common/Header';
import {NativeToastTop} from '../common/Toaster';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

import CalendarStrip from 'react-native-calendar-strip';
import {Checkbox} from 'react-native-paper';
import i18n from 'i18next';

var radio_props = [
  {label: 'Online Appointment', value: true},
  {label: 'Offline Appointment', value: false},
];
class BookAppointment extends Component {
  constructor(props) {
    super(props);
    let dateToday = new Date();
    let formattedDate = moment(dateToday).format('YYYY-MM-DD');

    this.state = {
      branchId: this.props.navigation.state.params.branchId,
      doctorId: this.props.navigation.state.params.doctorId,
      slot_timing: this.props.navigation.state.params.slot_timing,
      isLoading: true,
      value: '',
      personDetails: this.props.navigation.state.params.personDetails,
      appointmentTypes: [],
      selectedAppointmentType: '',
      timeSlotsMorning: [],
      timeSlotsAfternoon: [],
      timeSlotsEvening: [],
      visibleConfirmModal: false,
      visibleModal: false,
      filter: [],
      MorningFilter: [],
      AfternoonFilter: [],
      EveningFilter: [],
      selectedDate: formattedDate,
      dateToday: '',
      time_slot_value: '',
      appointment_type: '',
      complaint: '',
      appointment_type_price: '',
      modalHeight: '70%',
      salutation: '',
      patient_Name: '',
      patient_profile_img: '',
      patient_age: '',
      patient_email: '',
      patient_mobile: '',
      checking11: false,
      checking12: false,
      encounterModal: false,
      encounterVisibleModal: false,
      selectedEncounterId: '',
      encounterData: [],
      countrycode: '',
      is_online: false,
      onlineChecked: 'unchecked',
      offlineChecked: 'unchecked',
    };
  }
  onSelect = async checkbox => {
    console.log('value', checkbox);
    // let checkboxSelected=checkbox.split('@')
    if (this.state.is_online1 == true && checkbox == 'online') {
      this.setState({onlineChecked: 'checked', offlineChecked: 'unchecked'});
    } else if (this.state.is_online1 == false && checkbox == 'offline') {
      this.setState({onlineChecked: 'unchecked', offlineChecked: 'checked'});
    } else if (this.state.is_online1 == true && checkbox == 'offline') {
      if (this.state.offlineChecked == 'unchecked') {
        Alert.alert(
          i18n.t('PATIENTS.ALERT'),
          i18n.t('APPOINTMENT_CONFIRM.OFFLINE_ALERT'),
          [
            {
              text: i18n.t('PROFILE.YES'),
              onPress: () => {
                console.log('true1');
                this.setState({
                  onlineChecked: 'unchecked',
                  offlineChecked: 'checked',
                  is_online: false,
                  offline_online: 'offline',
                });
              },
            },
            {
              text: i18n.t('INITIAL_ASSESSMENT.NO'),
              onPress: () => {
                console.log('true2');
                this.setState({
                  onlineChecked: 'checked',
                  offlineChecked: 'unchecked',
                  is_online: true,
                  offline_online: 'online',
                });
              },
            },
          ],
        );
      }
    } else {
      if (this.state.onlineChecked == 'unchecked') {
        Alert.alert(
          i18n.t('PATIENTS.ALERT'),
          i18n.t('APPOINTMENT_CONFIRM.ONLINE_ALERT'),
          [
            {
              text: i18n.t('PROFILE.YES'),
              onPress: () => {
                console.log('true1');
                this.setState({
                  onlineChecked: 'checked',
                  offlineChecked: 'unchecked',
                  is_online: true,
                  offline_online: 'online',
                });
              },
            },
            {
              text: i18n.t('INITIAL_ASSESSMENT.NO'),
              onPress: () => {
                console.log('true2');
                this.setState({
                  onlineChecked: 'unchecked',
                  offlineChecked: 'checked',
                  is_online: false,
                  offline_online: 'offline',
                });
              },
            },
          ],
        );
      }
    }
  };

  componentDidMount = async () => {
    await getCountryCode().then(res => {
      this.setState({
        countrycode: res,
      });
    });
    let patientData = this.props.navigation.state.params.personDetails;

    let age =patientData &&  moment().diff(moment(patientData?.dob, 'DD MMM YYYY'), 'years');

    this.setState({
      salutation: patientData?.salutation,
      patient_Name:
        capitalize(patientData?.first_name) +
        ' ' +
        capitalize(patientData?.last_name),
      patient_profile_img:
        patientData?.person_image === null ? '' : patientData?.person_image,
      patient_age: capitalize(patientData?.gender) + ' ' + age + 'Yrs',
      patient_email: patientData?.email == null ? '' : patientData?.email,
      patient_mobile: patientData?.phone_no,
    });

    let dateToday = new Date().toLocaleDateString();
    let formattedDate = moment(dateToday).format('YYYY-MM-DD');

    this.setState({dateToday: formattedDate});
    await this.getAppointmentTypes();
    await this.getAvailableTimeSlots();
    // console.log(
    //   this.props.navigation.state.params.personDetails,
    //   'this.props.navigation.state.params',
    // );
  };

  UNSAFE_componentWillMount() {
    Keyboard.addListener('keyboardDidShow', e => this.keyboardDidShow(e));
    Keyboard.addListener('keyboardDidHide', e => this.keyboardDidHide(e));
  }

  keyboardDidShow(e) {
    this.setState({
      modalHeight: '80%',
      imageMargin: 100,
    });
  }
  keyboardDidHide(e) {
    this.setState({
      modalHeight: '70%',
      imageMargin: -100,
    });
  }

  openCloseLoginModal = () => {
    this.setState(prevState => ({
      visibleConfirmModal: !prevState.visibleConfirmModal,
      buttonsModal: !prevState.buttonsModal,
    }));
  };

  getAppointmentTypes = async () => {
    this.setState({isLoading: true});
    let url =
      getBaseUrl() +
      'v1/public/doctor/' +
      this.state.doctorId +
      '/branch/' +
      this.state.branchId +
      '/appointment/types';

    const resp = axios.get(url).then(response => {
      this.setState({appointmentTypes: response.data.data.types});
    });
    this.setState({isLoading: false});
  };

  hideModal = () => this.setState({visibleModal: false});

  onSelectAppointmentType = async (value, price) => {
    //console.log(value, "onSelectAppointmentType");

    const {branchId, doctorId} = this.props.navigation.state.params;

    if (value === 'review') {
      await getPaymentCriteria({
        healpha_id: this.state.personDetails.hlpid,
        doc_id: doctorId,
        branch_id: branchId,
        is_appointment: true,
        appointment_type: 'all',
        is_review: true,
      })
        .then(res => {
          //console.log(res, "success from book appointment paymentcriteria");

          this.setState({
            encounterModal: true,
            encounterData: res?.criteria?.visit_ids,
          });
        })
        .catch(res => {
          //console.log(res, "Error from book appointment paymentcriteria");
        });
    } else {
      this.setState({
        encounterModal: false,
      });
    }
    this.setState({selectedAppointmentType: value + '-' + price});
    this.setState({appointment_type: value});
    this.setState({appointment_type_price: price});
    this.hideModal();
  };

  getAvailableTimeSlots = async date1 => {
    this.setState({isLoading: true});

    let dateToday = new Date();
    console.log('dateToday', dateToday, new Date());
    let formattedDate = moment(dateToday).format('YYYY-MM-DD');
    console.log('Formattted date', formattedDate, dateToday);
    this.setState({isLoading: true});
    let date =
      date1 == undefined || date1 == null || date1 == ''
        ? formattedDate
        : date1; //YYYY-MM-DD
    console.log('date todayy', date, date1);

    try {
      let url =
        getBaseUrl() +
        `v1/public/doctor/${this.state.doctorId}/branch/${
          this.state.branchId
        }/appointment/available-timings?date=${
          date == 'Invalid date' ? formattedDate : date
        }`;
      console.log('url of the slot', url);
      axios.get(url).then(
        response => {
          console.log('today slots response------', response.data);
          this.setState({
            timeSlotsMorning: response.data.data.free_slots.morning,
          });
          this.setState({
            timeSlotsAfternoon: response.data.data.free_slots.afternoon,
          });
          this.setState({
            timeSlotsEvening: response.data.data.free_slots.evening,
          });

          if (this.state.timeSlotsMorning != undefined) {
            let Mor = this.state.timeSlotsMorning.filter(item => {
              let timeNow = moment(new Date()).format('hh:mm');
              let arr = [];
              this.state.filter = arr;

              if (item.value > timeNow) {
                return item.value;
              }
            });

            this.setState({MorningFilter: Mor});
          }

          if (this.state.timeSlotsAfternoon != undefined) {
            let Aft = this.state.timeSlotsAfternoon.filter(item => {
              let timeNow = moment(new Date()).format('hh:mm');

              let arr = [];
              this.state.filter = arr;

              if (item.value > timeNow) {
                return item.value;
              }
            });
            this.setState({AfternoonFilter: Aft});
          }

          if (this.state.timeSlotsEvening != undefined) {
            let Eve = this.state.timeSlotsEvening.filter(item => {
              let timeNow = moment(new Date()).format('hh:mm');

              let arr = [];
              this.state.filter = arr;

              if (item.value > timeNow) {
                return item.value;
              }
            });
            this.setState({EveningFilter: Eve});
          }
          this.setState({isLoading: false});
        },
        err => {
          console.error('slot error', err);
        },
      );
    } catch {
      console.error('slot error', error);
    }

    this.setState({isLoading: false});
  };

  renderMorningTimeSlots() {
    const {t} = this.props;
    return (
      <View>
        <View style={styles.timeDayView}>
          <Image
            testID="sunMorningImage"
            accessibilityLabel="sunMorningImage"
            style={styles.timeDayImage}
            source={require('../../../assets/images/sun.png')}
          />
          <Text
            style={styles.timeDayText}
            testID="morningText"
            accessibilityLabel="morningText">
            {t('APPOINTMENT_CONFIRM.MORNING')}
          </Text>
        </View>
        <View style={styles.slotViewFlatlist}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              //horizontal
              data={this.state.MorningFilter}
              renderItem={({item}) => (
                <View style={styles.flatlistView}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => this.chooseTimeSlot(item.label, item.value)}>
                    <Image
                      testID="clockImage"
                      accessibilityLabel="clockImage"
                      style={styles.clockImage}
                      source={require('../../../assets/images/clock.png')}
                    />
                    <Text
                      style={styles.buttonText}
                      testID={item.label + 'text'}
                      accessibilityLabel={item.label + 'text'}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              //showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  renderAfternoonTimeSlots() {
    const {t} = this.props;
    return (
      <View>
        <View style={styles.timeDayView}>
          <Image
            testID="sunImage"
            accessibilityLabel="sunImage"
            style={styles.timeDayImage}
            source={require('../../../assets/images/sun.png')}
          />
          <Text
            style={styles.timeDayText}
            testID="afternoonImage"
            accessibilityLabel="afternoonImage">
            {t('APPOINTMENT_CONFIRM.AFTERNOON')}
          </Text>
        </View>
        <View style={styles.slotViewFlatlist}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              //horizontal
              data={this.state.AfternoonFilter}
              renderItem={({item}) => (
                <View style={styles.flatlistView}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => this.chooseTimeSlot(item.label, item.value)}>
                    <Image
                      testID="clockImage"
                      accessibilityLabel="clockImage"
                      style={styles.clockImage}
                      source={require('../../../assets/images/clock.png')}
                    />
                    <Text
                      style={styles.buttonText}
                      testID={item.label + 'text'}
                      accessibilityLabel={item.label + 'text'}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              //showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  renderEveningTimeSlots() {
    const {t} = this.props;
    return (
      <View>
        <View style={styles.timeDayView}>
          <Image
            testID="sunEveningImage"
            accessibilityLabel="sunEveningImage"
            style={styles.timeDayImage}
            source={require('../../../assets/images/sunevening.png')}
          />
          <Text
            style={styles.timeDayText}
            testID="eveningText"
            accessibilityLabel="eveningText">
            {t('APPOINTMENT_CONFIRM.EVENING')}
          </Text>
        </View>
        <View style={styles.slotViewFlatlist}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              //horizontal
              data={this.state.EveningFilter}
              renderItem={({item}) => (
                <View style={styles.flatlistView}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => this.chooseTimeSlot(item.label, item.value)}>
                    <Image
                      testID="closeImage"
                      accessibilityLabel="closeImage"
                      style={styles.clockImage}
                      source={require('../../../assets/images/clock.png')}
                    />
                    <Text
                      style={styles.buttonText}
                      testID={item.label + 'text'}
                      accessibilityLabel={item.label + 'text'}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              //showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  dateSelected = date => {
    const store_date = date;
    this.setState({selectedDate: store_date});
    let dateToday = new Date();
    let formattedDate = moment(dateToday).format('YYYY-MM-DD');
    let n1 = date.toString();
    let n2 = formattedDate.toString();
    this.setState({
      MorningFilter: [],
      AfternoonFilter: [],
      EveningFilter: [],
    });
    if (n1 > n2) {
      this.getAvailableTimeSlots_new(date);
    } else {
      this.getAvailableTimeSlots(date);
    }
  };

  getAvailableTimeSlots_new = async date => {
    this.setState({isLoading: true, selectedDate: date});

    let date_new = date;

    try {
      axios
        .get(
          getBaseUrl() +
            `v1/public/doctor/${this.state.doctorId}/branch/${this.state.branchId}/appointment/available-timings?date=${date_new}`,
        )
        .then(response => {
          // console.log("new slots", response);
          this.setState({
            MorningFilter: response.data.data.free_slots.morning,
          });
          this.setState({
            AfternoonFilter: response.data.data.free_slots.afternoon,
          });
          this.setState({
            EveningFilter: response.data.data.free_slots.evening,
          });
        });
    } catch {
      // console.error(error);
    }

    this.setState({isLoading: false});
  };

  renderConfirmModal = () => {
    const {t} = this.props;
    let Doc_img = require('../../../assets/images/user.png');
    let img_uri = this.state?.patient_profile_img?.trim();
    let new_profile_img;
    if (img_uri?.length > 0) {
      new_profile_img = {uri: getApiUrl() + '/' + img_uri};
    } else {
      new_profile_img = Doc_img;
    }

    // let Doc_img = require('../../../assets/images/user.png');
    // let img_uri = this.state.patient_profile_img?.trim();
    // let uri;
    // if (img_uri.length > 0) {
    //   uri = getApiUrl() + '/' + img_uri;
    // } else {
    //   uri = Doc_img;
    // }

    return (
      <Modal
        isVisible={this.state.visibleConfirmModal}
        backdropOpacity={0.2}
        style={styles.modalPaddingStyles}>
        {/* modal view start */}

        <KeyboardAvoidingView
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={[styles.loginModal]}
            onPress={Keyboard.dismiss}>
            <View style={styles.flexDirectionRow}>
              <View style={styles.flex}>
                <Text
                  style={styles.modalHeaderText1}
                  testID="confirmSAppointmentText"
                  accessibilityLabel="confirmSAppointmentText">
                  {t('APPOINTMENT_CONFIRM.CONFIRM_APPOINTMENT')}
                </Text>
                <Text
                  style={styles.modalHeaderSubText1}
                  testID="checkDetailsText"
                  accessibilityLabel="checkDetailsText">
                  {t('APPOINTMENT_CONFIRM.CHECK_DETAILS')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => this.openCloseLoginModal()}>
                <Image
                  testID="closeImage"
                  accessibilityLabel="closeImage"
                  source={require('../../../assets/images/close.png')}
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Divider
              style={{height: 1, backgroundColor: 'gray', marginTop: 15}}
            />
            {/* <ScrollView> */}
            <View style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.flexDirectionRow}>
                  <View>
                    <Text
                      style={styles.modalHeaderText1}
                      testID={this.state.patient_Name + 'text'}
                      accessibilityLabel={this.state.patient_Name + 'text'}>
                      {this.state.patient_Name}
                    </Text>
                    <Text
                      style={[styles.modalHeaderSubText1, {marginVertical: 0}]}
                      testID={this.state.patient_age + 'text'}
                      accessibilityLabel={this.state.patient_age + 'text'}>
                      {this.state.patient_age}
                    </Text>
                  </View>
                </View>
                <View>
                  <Thumbnail
                    testID="profileImage"
                    accessibilityLabel="profileImage"
                    large
                    source={new_profile_img}
                    style={styles.modalDocPic}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text
                style={styles.modalSubText1}
                testID="appointmentTypeText"
                accessibilityLabel="appointmentTypeText">
                {/* Appointment Type */}
                {t('APPOINTMENT_CONFIRM.APPOINTMENT_TYPE')}
              </Text>
              <Text style={styles.modalHeaderSubText1}>
                {this.state.selectedAppointmentType}
              </Text>
            </View>

            <View>
              <Text
                style={styles.modalSubText1}
                testID="appointmentDateTimeText"
                accessibilityLabel="appointmentDateTimeText">
                {t('APPOINTMENT_CONFIRM.APPOINTMENT_DATE_TIME')}
                {/* Appointment Date & Time */}
              </Text>
              <Text
                style={styles.modalHeaderSubText1}
                testID={
                  this.state.selectedDate +
                  this.state.time_slot_value +
                  this.state.dtime +
                  'text'
                }
                accessibilityLabel={
                  this.state.selectedDate +
                  this.state.time_slot_value +
                  this.state.dtime +
                  'text'
                }>
                {this.state.selectedDate},{'  '}
                {this.state.time_slot_value} {this.state.dtime}
              </Text>
            </View>
            <View style={styles.inputSectionMainView}>
              <Text
                style={styles.modalSubText1}
                testID="complaintsText"
                accessibilityLabel="complaintsText">
                {t('APPOINTMENT_CONFIRM.COMPLAINT')}
              </Text>

              <TextInput
                testID="complaintsTextInput"
                accessibilityLabel="complaintsTextInput"
                multiline={true}
                autoCapitalize={'none'}
                style={styles.complaintsTextInput}
                placeholder={`${t('APPOINTMENT_CONFIRM.COMPLAINTS')}`}
                onChangeText={text => this.setState({complaint: text})}
              />
            </View>
            {/* </ScrollView> */}

            <View style={styles.bottomViewStyles}>
              <Button
                style={styles.loginStyles}
                onPress={() => {
                  this.setState({visibleConfirmModal: false});
                  setTimeout(() => {
                    this.book();
                  }, 250);
                }}
                testID="confirmButton"
                accessibilityLabel="confirmButton">
                <Text
                  style={styles.loginButtonText}
                  testID="confirmText"
                  accessibilityLabel="confirmText">
                  {/* Confirm */}
                  {t('DASHBOARD.CONFIRM_BUTTON_TEXT')}
                </Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  chooseTimeSlot = async (time, val) => {
    const {t} = this.props;
    this.setState({time_slot_value: val});

    if (this.state.appointment_type === 'review') {
      if (this.state.selectedEncounterId === '') {
        NativeToastTop({
          text: t('BOOKING.PLEASE_SELECT_ENCOUNTER_ID'),
          type: 'danger',
        });
        return;
      }
    }

    if (this.state.appointment_type == '') {
      NativeToastTop({
        text: t('BOOKING.PLEASE_SELECT_APP_TYPE'),
        type: 'danger',
      });
    } else if (this.state.selectedDate == '') {
      Toast.show({
        text: 'Please select appointment Date',
        buttonText: 'Okay',
        duration: 2000,
        type: 'danger',
        style: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
      });
    } else {
      this.setState({visibleConfirmModal: true});
    }
  };

  book = async () => {
    if (!this.state.complaint) {
      Toast.show({
        text: 'Please Enter Complaint',
        type: 'warning',
        duration: 6000,
        position: 'top',
      });
      return;
    }

    this.setState({
      visibleConfirmModal: false,
    });

    const {t} = this.props;
    this.setState({isLoading: true});

    // let url = getBaseUrl() + 'ical/';

    let hlpid = this.state.personDetails.hlpid;
    const {branchId, doctorId} = this.props.navigation.state.params;

    let ob = JSON.stringify({
      doctor_id: doctorId,
      branch_id: branchId,
      appointment_date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
      appointment_time: this.state.time_slot_value,
      appointment_type: this.state.appointment_type,
      description: this.state.complaint,
      amount: this.state.appointment_type_price,
      type: 'app_appointment',
      encounter_id:
        this.state.appointment_type === 'review'
          ? this.state.selectedEncounterId
          : '',
      is_online_appointment: this.state.is_online,
    });

    await createAppointment(hlpid, ob)
      .then(res => {
        this.setState({isLoading: false});

        if (res.message === 'Appointment booked.') {
          NativeToastTop({text: 'Appointment is booked', type: 'success'});
          this.setState({
            visibleConfirmModal: false,
          });

          this.props.navigation.navigate('HomeScreen', {qr_code_hlp_id: ''});
          setTimeout(() => {
            DeviceEventEmitter.emit('updateHomeScreen', {
              date: this.state.selectedDate,
            });
          }, 1000);
        } else {
          this.setState({isLoading: false});
          //console.log(res.message);
          // Alert.alert(
          //   t('BOOKING.APPOINTMENT_NOT_BOOKED'),
          //   t('BOOKING.CONTACT_HEALPHA_HELPDESK'),
          //   [
          //     {
          //       text: t('BOOKING.OK'),
          //       onPress: () => {
          //         this.props.navigation.navigate('HomeScreen'),
          //           DeviceEventEmitter.emit('updateHomeScreen');
          //       },
          //     },
          //   ],
          // );
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        NativeToastTop({text: err.message, type: 'warning'});

        setTimeout(() => {
          this.setState({
            visibleConfirmModal: true,
          });
        }, 250);
      });

    // await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: ob,
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //
    //   })
    //   .catch((error) => {
    //     this.setState({isLoading: false});
    //     NativeToastTop({text: error.message, type: 'warning'});
    //   });
  };
  selectedItem = selectedItem => {
    this.setState({
      selectedEncounterId: selectedItem.id,
      is_online: selectedItem.is_online_appointment,
      onlineChecked:
        selectedItem.is_online_appointment == true ? 'checked' : 'unchecked',
      offlineChecked:
        selectedItem.is_online_appointment == false ? 'checked' : 'unchecked',
    });
  };
  render() {
    const {t} = this.props;

    const image = this.state.personDetails?.person_image;

    let profile_image_uri = {
      uri: getApiUrl() + '/' + this.state?.personDetails?.person_image,
    };

    let datesWhitelist = [
      {
        start: moment(),
        end: moment().add(31, 'days'), // total 4 days enabled
      },
    ];

    let Doc_img = require('../../../assets/images/user.png');
    let img_uri = this.state?.patient_profile_img?.trim();
    let new_profile_img;
    if (img_uri?.length > 0) {
      new_profile_img = {uri: getApiUrl() + '/' + img_uri};
    } else {
      new_profile_img = Doc_img;
    }

    let {remoteVisitList, remoteVisit} = this.props.navigation.state.params;

    return (
      <View style={styles.containerView}>
        {/* <SimpleHeader
            title={'Create Appointment'}
            navigation={this.props.navigation}
          /> */}
        <Header
          testID="createAppointmentHeader"
          accessibilityLabel="createAppointmentHeader"
          title={`${t('APPOINTMENT_CONFIRM.CREATE_APPOINTMENT')}`}
          navigation={this.props.navigation}
        />
        {this.state.isLoading && (
          <View style={{flex: 1, alignSelf: 'center', paddingTop: 50}}>
            <Loader />
          </View>
        )}

        {!this.state.isLoading && (
          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 40}}
            contentContainerStyle={{paddingBottom: 20}}>
            <View>
              <Card style={{paddingBottom: 20, marginTop: -0.5}}>
                <CardItem>
                  <Left>
                    {/* <Avatar
                        size="large"
                        rounded
                        title="MT"
                        // activeOpacity={0.5}
                      /> */}
                    <Thumbnail
                      testID="profileThumbnail"
                      accessibilityLabel="profileThumbnail"
                      source={new_profile_img}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: -20,
                      }}
                    />
                  </Left>
                  <Body style={{marginLeft: wp(-250), marginTop: 20}}>
                    <Text
                      style={{
                        fontSize: theme.fontSizes.md,
                        fontFamily: theme.fontFamily.primaryBold,
                        marginLeft: 10,
                      }}
                      testID={this.state.patient_Name + 'text'}
                      accessibilityLabel={this.state.patient_Name + 'text'}>
                      {this.state.salutation + '. ' + this.state.patient_Name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 5,
                      }}>
                      <Image
                        source={Name}
                        style={styles.icon1}
                        testID="patientImage"
                        accessibilityLabel="patientImage"
                      />
                      <Text
                        style={[styles.input, styles.textfont, styles.left]}
                        testID={this.state.patient_age + 'text'}
                        accessibilityLabel={this.state.patient_age + 'text'}>
                        {this.state.patient_age}
                      </Text>
                    </View>
                    {this.state.patient_email ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 5,
                        }}>
                        <Image
                          source={email}
                          style={styles.icon}
                          testID="emailIcon"
                          accessibilityLabel="emailIcon"
                        />
                        <Text
                          style={[styles.input, styles.textfont]}
                          testID={this.state.patient_email + 'text'}
                          accessibilityLabel={
                            this.state.patient_email + 'text'
                          }>
                          {this.state.patient_email}
                        </Text>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 5,
                      }}>
                      <Image
                        source={phone}
                        style={styles.icon}
                        testID="phoneImage"
                        accessibilityLabel="phoneImage"
                      />
                      <Text
                        style={[styles.input, styles.textfont]}
                        testID={this.state.patient_mobile + 'text'}
                        accessibilityLabel={this.state.patient_mobile + 'text'}>
                        {this.state.countrycode +
                          ' ' +
                          this.state.patient_mobile}
                      </Text>
                    </View>
                  </Body>
                </CardItem>
              </Card>
            </View>
            {/* <View>
                <Text style={{marginLeft: wp(20), marginTop: wp(15)}}>
                  Appointment Type
                </Text>
              </View> */}

            <View style={{marginHorizontal: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                }}>
                <FontAwesomeIcon
                  testID="stethoscopeIcon"
                  accessibilityLabel="stethoscopeIcon"
                  name="stethoscope"
                  size={20}
                  color="#151414"
                  style={{paddingVertical: 5}}
                />
                <Text
                  style={{
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingLeft: 5,
                    fontSize: 15,
                    color: '#151414',
                    fontFamily: 'NunitoSans-Regular',
                  }}
                  testID="appointmentTypeText"
                  accessibilityLabel="appointmentTypeText">
                  {t('APPOINTMENT_CONFIRM.APPOINTMENT_TYPE')}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  width: '100%',
                  borderColor: '#E0E0E0',
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                }}
                onPress={() =>
                  this.setState({visibleModal: !this.state.visibleModal})
                }
                testID="selectAppointmentTouch"
                accessibilityLabel="selectAppointmentTouch">
                {this.state.selectedAppointmentType == '' ? (
                  <Text
                    style={{
                      alignItems: 'center',
                      margin: 8,
                      color: '#151414',
                      fontSize: 15,
                      fontFamily: 'NunitoSans-Regular',
                    }}
                    testID="selectAppointmentText"
                    accessibilityLabel="selectAppointmentText">
                    {t('APPOINTMENT_CONFIRM.SELECT_APPOINTMENT')}
                  </Text>
                ) : (
                  <Text
                    style={{
                      alignItems: 'center',
                      margin: 8,
                      color: '#151414',
                      fontSize: 15,
                      fontFamily: 'NunitoSans-Regular',
                    }}
                    testID={this.state.selectedAppointmentType + 'text'}
                    accessibilityLabel={
                      this.state.selectedAppointmentType + 'text'
                    }>
                    {this.state.selectedAppointmentType.replace(
                      /^./,
                      this.state.selectedAppointmentType[0]?.toUpperCase(),
                    )}
                  </Text>
                )}

                <FontAwesomeIcon
                  testID="arrowIcon1"
                  accessibilityLabel="arrowIcon1"
                  name="angle-down"
                  size={20}
                  color="#151414"
                  style={{paddingVertical: 5, marginRight: 10}}
                />
              </TouchableOpacity>
            </View>

            <View
              style={
                this.state.encounterModal
                  ? {display: 'flex', marginTop: 10}
                  : {display: 'none'}
              }>
              <View style={{marginHorizontal: 20}}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    width: '100%',
                    borderColor: '#E0E0E0',
                    flexDirection: 'row',
                    // alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                  }}
                  onPress={() =>
                    this.setState({
                      encounterVisibleModal: !this.state.encounterVisibleModal,
                    })
                  }
                  testID="selectAppointmentTypeTouch"
                  accessibilityLabel="selectAppointmentTypeTouch">
                  {this.state.selectedEncounterId == '' ? (
                    <Text
                      style={{
                        alignItems: 'center',
                        margin: 8,
                        color: '#151414',
                        fontSize: 15,
                        fontFamily: 'NunitoSans-Regular',
                      }}
                      testID="selectAppointmentTypeText"
                      accessibilityLabel="selectAppointmentTypeText">
                      {t('BOOKING.SELECT_APP_TYPE')}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        alignItems: 'center',
                        margin: 8,
                        color: '#151414',
                        fontSize: 15,
                        fontFamily: 'NunitoSans-Regular',
                      }}
                      testID={this.state.selectedEncounterId + 'text'}
                      accessibilityLabel={
                        this.state.selectedEncounterId + 'text'
                      }>
                      {this.state.selectedEncounterId}
                    </Text>
                  )}

                  <FontAwesomeIcon
                    testID="arrowIcon"
                    accessibilityLabel="arrowIcon"
                    name="angle-down"
                    size={20}
                    color="#151414"
                    style={{paddingVertical: 5, marginRight: 10}}
                  />
                </TouchableOpacity>
              </View>
              {this.state.selectedEncounterId != '' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: "center"
                    marginHorizontal: 20,
                  }}>
                  <Checkbox
                    testID="checkBox"
                    accessibilityLabel="checkBox"
                    status={this.state.onlineChecked}
                    onPress={() => {
                      const res =
                        this.state.onlineChecked == 'checked'
                          ? 'unchecked'
                          : 'checked';
                      this.onSelect('online');
                    }}
                    color="#444"
                  />
                  <Text
                    style={{margin: 2, marginTop: 6}}
                    testID="onlineAppointment"
                    accessibilityLabel="onlineAppointment">
                    {t('APPOINTMENT_CONFIRM.ONLINE_APPOINTMENT')}{' '}
                  </Text>
                  <Checkbox
                    testID="checkBox"
                    accessibilityLabel="checkBox"
                    status={this.state.offlineChecked}
                    onPress={() => {
                      const res =
                        this.state.offlineChecked == 'checked'
                          ? 'unchecked'
                          : 'checked';
                      this.onSelect('offline');
                    }}
                    color="#444"
                  />
                  <Text
                    style={{margin: 2, marginTop: 6}}
                    testID="offlineAppointmentText"
                    accessibilityLabel="offlineAppointmentText">
                    {t('APPOINTMENT_CONFIRM.OFFLINE_APPOINTMENT')}
                  </Text>
                </View>
              ) : null}
            </View>

            <CalendarStrip
              testID="calenderStrip"
              accessibilityLabel="calenderStrip"
              calendarAnimation={{
                type: 'parallel',
                //duration: 30,
                // useNativeDriver: false,
              }}
              scrollToOnSetSelectedDate={true}
              scrollable={true}
              daySelectionAnimation={{
                type: 'background',
                duration: 200,
                highlightColor: '#EEEEEE',
              }}
              style={{
                height: 100,
                paddingTop: 20,
                paddingBottom: 10,
                marginVertical: 10,
              }}
              calendarHeaderStyle={{
                color: '#345D7E',
                paddingBottom: 10,
                marginTop: -15,
              }}
              calendarColor={'#FAFBFF'}
              dateNumberStyle={{color: '#345D7E'}}
              dateNameStyle={{color: '#345D7E'}}
              // highlightDateNumberStyle={{color: '#F67F7D'}}
              // highlightDateNameStyle={{color: '#F67F7D'}}
              // dateNumberStyle={{color: {APP_PRIMARY_COLOR}}}
              // dateNameStyle={{color: {APP_PRIMARY_COLOR}}}
              highlightDateNumberStyle={{color: {APP_PRIMARY_COLOR}}}
              highlightDateNameStyle={{color: {APP_PRIMARY_COLOR}}}
              disabledDateNameStyle={{color: 'grey'}}
              disabledDateNumberStyle={{color: 'grey'}}
              datesWhitelist={datesWhitelist}
              datesBlacklist={this.state.blacklist}
              onDateSelected={date =>
                this.dateSelected(date.format('YYYY-MM-DD'))
              }
              iconContainer={{flex: 0.1}}
              minDate={new Date()}
            />

            {/* <CalendarProvider
              style={{ marginVertical: 10 }}
              date={this.state.selectedDate}
              onDateChanged={(date) => {
                this.dateSelected(date);
              }}>
              <WeekCalendar
                firstDay={1}
                minDate={new Date().toISOString()}
                onDayPress={(date) => {
                  this.dateSelected(date.dateString);
                }}
              />
            </CalendarProvider> */}

            {!this.state.isLoading && this.renderMorningTimeSlots()}

            {!this.state.isLoading && this.renderAfternoonTimeSlots()}

            {!this.state.isLoading && this.renderEveningTimeSlots()}
          </ScrollView>
        )}

        <Modal
          style={styles.modal}
          isVisible={this.state.visibleModal}
          onBackdropPress={this.hideModal}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={styles.modalHeadertext}
                  testID="appointmentTypeText"
                  accessibilityLabel="appointmentTypeText">
                  {t('APPOINTMENT_CONFIRM.APPOINTMENT_TYPE')}
                </Text>
              </View>
              <TouchableOpacity onPress={this.hideModal}>
                <Icon
                  testID="circleIcon"
                  accessibilityLabel="circleIcon"
                  name="close-circle-outline"
                  size={30}
                  color="#131B27"
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            </View>

            {this.state.appointmentTypes.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.onSelectAppointmentType(
                      item.appointment_type_value,
                      item.price,
                    )
                  }>
                  <Text
                    style={styles.modalTextType}
                    testID={item.appointment_type_name + item.price + 'text'}
                    accessibilityLabel={
                      item.appointment_type_name + item.price + 'text'
                    }>
                    {item.appointment_type_name}({item.price})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Modal>

        <Modal
          isVisible={this.state.encounterVisibleModal}
          style={{margin: 0, padding: 0}}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: '30%',
                backgroundColor: DEFAULT_WHITE_COLOR,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={styles.modalHeadertext}
                    testID="selectAppointmentTypeText"
                    accessibilityLabel="selectAppointmentTypeText">
                    {t('APPOINTMENT_CONFIRM.SELECT_APP_TYPE')}
                  </Text>
                  {/* <Text
                    style={{
                      paddingHorizontal: 20,
                      fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                    }}>
                    All the medicines prescribed in the list
                  </Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({encounterVisibleModal: false});
                  }}>
                  <Icon
                    testID="closeIcon"
                    accessibilityLabel="closeIcon"
                    name="close"
                    size={20}
                    color="#131B27"
                    style={{marginRight: 10, marginTop: 10}}
                  />
                </TouchableOpacity>
              </View>
              <View style={{margin: 15}}>
                <SelectDropdown
                  data={this.state.encounterData}
                  // defaultValueByIndex={1}
                  onSelect={(selectedItem, index) => {
                    this.setState({
                      selectedEncounterId: selectedItem.id,
                      is_online: selectedItem.is_online_appointment,
                      is_online1: selectedItem.is_online_appointment,
                    });
                    this.selectedItem(selectedItem);
                  }}
                  defaultButtonText={t('BOOKING.SELECT_APP_TYPE')}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.id;
                  }}
                  rowTextForSelection={(encounter, index) => {
                    return encounter.id;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        testID="arrowIcon"
                        accessibilityLabel="arrowIcon"
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>
              <FooterButton
                label={t('BOOKING.CONFIRM')}
                onPress={() => {
                  this.setState({encounterVisibleModal: false});
                }}
              />
            </View>
          </View>
        </Modal>

        {this.renderConfirmModal()}
      </View>
    );
  }
}

export default withTranslation()(BookAppointment);
