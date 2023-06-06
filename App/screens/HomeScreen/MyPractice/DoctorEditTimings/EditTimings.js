import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Container, Footer, Button, CheckBox, Toast} from 'native-base';
import Modal from 'react-native-modal';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

//styles
import styles from './DoctorEditTimingsStyles';
import AppLoader from '../../../HomeScreen/Common/AppLoader';

//images
import Close from '../../../../assets/images/close.svg';
import RightArrow from '../../../../assets/images/right_arrow_filled.svg';
import {StringToIntConversion} from '../../../../utils/StringToIntConversion';
import {divide} from 'react-native-reanimated';
import {
  convert12To24Hrs,
  convert24To12Hrs,
} from '../../CovidMonitoring/Utils/DateTimeUtil';

import {
  updateSessionTimings,
  getSessionTimings,
  getAppointmentTypes
} from '../../../../services/MyPracticeService';
import {nameConversion} from '../../../../utils/NameConversion';
import i18n from '../../../../../i18n';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Right, Icon} from 'native-base';

class EditTimings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      editTimings: {},
      session: '',
      checkbox: false,
      modal: false,
      no_appointments: 0,
      general_count: '',
      emergency_count: '',
      telemedicine_count: '',
      homecare_count: '',
      covid_count: '',
      vip_count: '',
      start_key: '',
      slot_timing: '',
      session_timings: {},
      init: true,
      appointment_counts: {},
      startTime: false,
      endTime: false,
      appt_type: {},
      appt_type_count: {}
    };
  }

  calculateAppointmentsOfSession = (
    session_timings,
    start_key,
    end_key,
    slot_timing,
  ) => {
    let start_time = moment(session_timings[start_key], 'HH:mm');

    let end_time = moment(session_timings[end_key], 'HH:mm');

    let count = 0;
    while (start_time < end_time) {
      count++;
      start_time = start_time.add(slot_timing, 'minutes');
    }
    return count;
  };

  generateSessionTimes = (
    session_timings,
    start_key,
    end_key,
    slot_timing,
    total_appointments,
  ) => {
    let divide_slots = Math.ceil(total_appointments / 2);

    let start_slots = divide_slots;
    let end_slots = divide_slots;

    const startTimes = [];

    const endTimes = [];

    const session_start_time = moment(
      session_timings[start_key],
      'hh:mm',
    ).format('LT');

    const session_end_time = moment(session_timings[end_key], 'hh:mm').format(
      'LT',
    );

    startTimes.push(session_start_time);

    let initial_stat_time = moment(session_timings[start_key], 'hh:mm');

    while (start_slots - 1 > 0) {
      initial_stat_time = initial_stat_time.add(slot_timing, 'minutes');

      startTimes.push(moment(initial_stat_time, 'hh:mm').format('LT'));

      start_slots--;
    }

    while (end_slots > 0) {
      initial_stat_time = initial_stat_time.add(slot_timing, 'minutes');

      endTimes.push(moment(initial_stat_time, 'hh:mm').format('LT'));

      end_slots--;
    }

    if (end_slots % 2 === 0) {
      endTimes.push(session_end_time);
    }

    return {
      startTimes: startTimes,
      endTimes: endTimes,
    };
  };

  componentDidMount = async () => {
    const {
      session,
      start_key,
      end_key,
      slot_timing,
      session_timings,
      day,
      session_id,
      branch_id
    } = this.props?.navigation?.state?.params;
    global.appt_type_count_data=false
    const weekly_timing_id = session_timings?.weekly_timing_id;

    const response = await getSessionTimings(
      session_id,
      weekly_timing_id,
      day.toLowerCase(),
    );
    const doctor_id = await AsyncStorage.getItem('doctorid');
    const appt_type = await getAppointmentTypes(branch_id,branch_id.split('-')[0],doctor_id)
    session_timings?.appoinment_type_limits.map((elements1, index)=>{
      if(elements1?.day==day.toLowerCase()){
        this.setState({appt_type_count:elements1})
        global.appt_type_count_data=true
      }
    }
    )
    this.setState({appt_type:appt_type.data.appointment_prices.appointmentTypePrices})
    const total_appointments = this.calculateAppointmentsOfSession(
      session_timings,
      start_key,
      end_key,
      slot_timing,
    );

    const times = this.generateSessionTimes(
      session_timings,
      start_key,
      end_key,
      slot_timing,
      total_appointments,
    );

    if (response && response?.data) {
      const {
        general_count,
        emergency_count,
        telemedicine_count,
        homecare_count,
        covid_count,
        vip_count,
      } = response?.data;
      if(global.appt_type_count_data==false){
        const appt_type_data={"covid_count": 0, "day": day.toLowerCase(), "emergency_count": 0, "general_count": 0, "homecare_count": 0, "id": 119, "max_count": 0, "review_count": 0, "session_id": session_id, "telemedicine_count": 0, "vip_count": 0, "weekly_timing_id": weekly_timing_id}
        this.setState({appt_type_count:appt_type_data})
        global.appt_type_count_data=true
      }
      this.setState({
        general_count,
        emergency_count,
        telemedicine_count,
        homecare_count,
        covid_count,
        vip_count,
      });
    }

    // const {
    //   general_count,
    //   emergency_count,
    //   telemedicine_count,
    //   homecare_count,
    //   covid_count,
    //   vip_count,
    // } = response.data;

    this.setState({
      session: session,
      loader: false,
      start_key: start_key,
      end_key: end_key,
      slot_timing: slot_timing,
      session_timings: session_timings,
      no_appointments: total_appointments,
      startTimes: times.startTimes,
      endTimes: times.endTimes,
      day: day,
      session_id: session_id,
      appointment_counts: response.data,
      // general_count,
      // emergency_count,
      // telemedicine_count,
      // homecare_count,
      // covid_count,
      // vip_count,
    });

    this.props.navigation.addListener('willFocus', this._handleStateChange);
  };

  componentWillUnmount() {
    // this.props.onRef(null);
  }

  _handleStateChange = state => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
  };
  onStartTime = () => {
    this.setState({startTime: true});
  };
  onEndTime = () => {
    this.setState({endTime: true});
  };
  updateTime = async (time, key) => {
    const {session_timings, start_key, end_key, slot_timing} = this.state;

    const hrs = convert12To24Hrs(time);

    session_timings[key] = hrs;

    const total_appointments = await this.calculateAppointmentsOfSession(
      session_timings,
      start_key,
      end_key,
      slot_timing,
    );

    this.setState(
      {
        session_timings: session_timings,
        no_appointments: total_appointments,
        startTime: false,
        endTime: false,
      },
      () => this.updateTimingsOfAllDays(),
    );
  };

  updateTimingsOfAllDays = () => {
    const checkbox = this.state.checkbox;
    if (checkbox) {
      this.saveSelectedDaysTimings();
    }
  };

  renderStartTimes = () => {
    const times = this.state.startTimes;

    const session_timings = this.state.session_timings;

    const start_key = this.state.start_key;

    return times.map((element, index) => (
      <TouchableOpacity
        testID={element.split(' ')[0] + 'touch'}
        accessibilityLabel={element.split(' ')[0] + 'touch'}
        style={[
          convert24To12Hrs(session_timings[start_key]) === element
            ? styles.activeTimeTouchableView
            : styles.timeTouchableView,
        ]}
        onPress={() => this.updateTime(element, start_key)}>
        <Text
          style={[
            convert24To12Hrs(session_timings[start_key]) === element
              ? styles.activeTime
              : styles.disableTime,
          ]}
          testID={element.split(' ')[0] + 'text'}
          accessibilityLabel={element.split(' ')[0] + 'text'}>
          {element.split(' ')[0]}
        </Text>
        <Text
          style={
            convert24To12Hrs(session_timings[start_key]) === element
              ? styles.activeTimeAmText
              : styles.disableTimeAmText
          }
          testID={element.split(' ')[1].toLowerCase() + 'text'}
          accessibilityLabel={element.split(' ')[1].toLowerCase() + 'text'}>
          {element.split(' ')[1].toLowerCase()}
        </Text>
      </TouchableOpacity>
    ));
  };

  renderEndTimes = () => {
    const times = this.state.endTimes;

    const session_timings = this.state.session_timings;

    const end_key = this.state.end_key;

    return times.map((element, index) => (
      <TouchableOpacity
        testID={element.split(' ')[0] + 'touch'}
        accessibilityLabel={element.split(' ')[0] + 'touch'}
        style={[
          convert24To12Hrs(session_timings[end_key]) === element
            ? styles.activeTimeTouchableView
            : styles.timeTouchableView,
        ]}
        onPress={() => this.updateTime(element, end_key)}>
        <Text
          style={
            convert24To12Hrs(session_timings[end_key]) === element
              ? styles.activeTime
              : styles.disableTime
          }
          testID={element.split(' ')[0] + 'text'}
          accessibilityLabel={element.split(' ')[0] + 'text'}>
          {element.split(' ')[0]}
        </Text>
        <Text
          style={
            convert24To12Hrs(session_timings[end_key]) === element
              ? styles.activeTimeAmText
              : styles.disableTimeAmText
          }
          testID={element.split(' ')[1].toLowerCase() + 'text'}
          accessibilityLabel={element.split(' ')[1].toLowerCase() + 'text'}>
          {element.split(' ')[1].toLowerCase()}
        </Text>
      </TouchableOpacity>
    ));
  };

  renderStartTimeSection = () => {
    return (
      <View style={styles.startTimeMainSection}>
        <View style={[styles.textAndToggleMainView]}>
          <Text
            style={styles.startTimeText}
            testID="startTimeText"
            accessibilityLabel="startTimeText">
            {i18n.t('MY_PRACTICES.EDIT_TIMINGS.START_TIME')}
          </Text>
        </View>
        <ScrollView horizontal={true}>{this.renderStartTimes()}</ScrollView>
      </View>
    );
  };

  renderEndTimeSection = () => {
    return (
      <View style={styles.endTimeMainView}>
        <View style={[styles.textAndToggleMainView]}>
          <Text
            style={styles.startTimeText}
            testID="endTimeText"
            accessibilityLabel="endTimeText">
            {i18n.t('MY_PRACTICES.EDIT_TIMINGS.END_TIME')}
          </Text>
        </View>
        <ScrollView horizontal={true}>{this.renderEndTimes()}</ScrollView>
      </View>
    );
  };

  renderHorizontalLine = () => {
    return <View style={styles.horizontalLine} />;
  };

  checkAppointmentsAvailable = (value,key) => {
    // let {
    //   no_appointments,
    //   general_count,
    //   emergency_count,
    //   telemedicine_count,
    //   homecare_count,
    //   covid_count,
    //   vip_count,
    // } = this.state;
    // let total =
    //   StringToIntConversion(general_count) +
    //   StringToIntConversion(emergency_count) +
    //   StringToIntConversion(telemedicine_count) +
    //   StringToIntConversion(homecare_count) +
    //   StringToIntConversion(covid_count) +
    //   StringToIntConversion(vip_count);
    let total= this.state.no_appointments
    if (total < value) {
      return false;
    }
    return true;
  };
  handleAppointmentsTextAlert = (text,key) => {
    let total= this.state.no_appointments
      Toast.show({
        text: i18n.t('MY_PRACTICES.ERRORS.APPOINTMENT_VALUE_ERROR') + ' ' + total,
        type: 'warning',
        duration: 5000,
      });
  }
  handleAppointmentsText = (text, key) => {
    const state = this.state;
    const flag = this.checkAppointmentsAvailable(parseInt(text),key);
    const {t} = this.props;
    let total= this.state.no_appointments
    if (flag) {
      state[key] = text;
    } else {
      state[key] = '';
      Toast.show({
        text: i18n.t('MY_PRACTICES.ERRORS.APPOINTMENT_VALUE_ERROR') + ' ' + total,
        type: 'warning',
        duration: 5000,
      });
    }
    const appt_count1=this.state.appt_type_count
    appt_count1[key]=text

    this.setState({
      ...state,
      appt_type_count:appt_count1,
    });
  };
  onChange = (input,key) => {
    console.log("onchange",input)
    const appt_count1=this.state.appt_type_count
    appt_count1[key] =
      input == 0
        ? this.state.no_appointments
        : input > 0
        ? 0
        : input;
    console.log("appt_count",appt_count1)
    this.setState({appt_type_count:appt_count1,session_timings:this.state.session_timings})
  }
  renderCheckBoxAndInput = (heading, input, key, testID) => {
    console.log("inputinput",input)
    const {appointment_counts} = this.state;
    return (
      <View style={styles.checkBoxAndTextView}>
        <View
          style={[
            styles.flex,
            styles.flexDirectionRow,
            styles.checkBoxAndText,
          ]}>
          <CheckBox
            checked={input>0?true:false}
            style={styles.checkBox}
            testID="checkBox"
            accessibilityLabel="checkBox"
            onPress={() =>
              this.onChange(input,key)
            }
          />
          <Text
            style={styles.checkBoxText}
            testID={heading + 'text'}
            accessibilityLabel={heading + 'text'}>
            {heading.replace(
              /^./,
              heading[0].toUpperCase()
            )}
          </Text>
        </View>
        <View style={styles.flex}>
          <TextInput
            testID={testID}
            accessibilityLabel={testID}
            style={styles.appointmentTextInput}
            keyboardType={'numeric'}
            defaultValue={input}
            placeholder={input.toString()}
            // returnKeyType="done"
            onChangeText={text => this.handleAppointmentsText(text, key)}
          />
        </View>
      </View>
    );
  };
  hidePicker = () => {
    this.setState({startTime: false, endTime: false});
  };
  renderCheckBoxSection = () => {
    const {
      session,
      start_key,
      end_key,
      slot_timing,
      session_timings,
      day,
      session_id,
      branch_id
    } = this.props?.navigation?.state?.params;
    return (
      <View>
        {this.state.appt_type.map((element, index) => ( 
            this.renderCheckBoxAndInput(
                element['appointment_type_name'],
                ((this.state.appt_type_count!=undefined) && (this.state.appt_type_count!=null) && (this.state.appt_type_count!={}) && (this.state.appt_type_count!="") && (Object.keys(this.state.appt_type_count).length!=0) && (this.state.appt_type_count[element['appointment_type_value']+'_count']!='') && (this.state.appt_type_count[element['appointment_type_value']+'_count']!=undefined) && (this.state.appt_type_count[element['appointment_type_value']+'_count']!=null) )?this.state.appt_type_count[element['appointment_type_value']+'_count']:0,
                element['appointment_type_value']+'_count',
                element['appointment_type_value']+'TextInput',
              )
        ))}
        {/* {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.GENERAL'),
          this.state.general_count,
          'general_count',
          'generalTextInput',
        )}
        {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.EMERGENCY'),
          this.state.emergency_count,
          'emergency_count',
          'emergrncyTextInput',
        )}
        {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.TELEMEDICINE'),
          this.state.telemedicine_count,
          'telemedicine_count',
          'telemedicineTextInput',
        )}
        {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.HOMECARE'),
          this.state.homecare_count,
          'homecare_count',
          'homeCareTextInput',
        )}
        {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.COVID'),
          this.state.covid_count,
          'covid_count',
          'covidTextInput',
        )}
        {this.renderCheckBoxAndInput(
          i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.COVID'),
          this.state.vip_count,
          'vip_count',
          'covidTextInput',
        )} */}
      </View>
    );
  };

  renderStartEndTime = () => {
    const times = this.state.startTimes;

    const session_timings = this.state.session_timings;

    const start_key = this.state.start_key;
    const end_key = this.state.end_key;
    return (
      <View style={styles.time1}>
        <View>
          <View style={[styles.textAndToggleMainView]}>
            <Text
              style={styles.startTimeText}
              testID="startTimeText"
              accessibilityLabel="startTimeText">
              {i18n.t('MY_PRACTICES.EDIT_TIMINGS.START_TIME')}
            </Text>
          </View>
          <View style={styles.time}>
            <TouchableOpacity
              testID={'touch'}
              accessibilityLabel={'touch'}
              style={styles.timing}
              onPress={() => {
                this.onStartTime();
              }}>
              <Text
                style={{alignSelf: 'center'}}
                testID={'text'}
                accessibilityLabel={'text'}>
                {moment(session_timings[start_key], 'hh:mm').format('LT')}
              </Text>
              <Icon name="clock" type="EvilIcons" style={styles.clockIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={[styles.endtextAndToggleMainView]}>
            <Text
              style={styles.startTimeText}
              testID="endTimeText"
              accessibilityLabel="endTimeText">
              {i18n.t('MY_PRACTICES.EDIT_TIMINGS.END_TIME')}
            </Text>
          </View>
          <View style={styles.time2}>
            <TouchableOpacity
              testID={'touch'}
              accessibilityLabel={'touch'}
              style={styles.timing}
              onPress={() => {
                this.onEndTime();
              }}>
              <Text
                style={{alignSelf: 'center'}}
                testID={'text'}
                accessibilityLabel={'text'}>
                {moment(session_timings[end_key], 'hh:mm').format('LT')}
              </Text>
              <Icon name="clock" type="EvilIcons" style={styles.clockIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  renderAppointmentsForSession = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        // style={{ flex: 1 }}
        onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={[styles.screenPadding, styles.appointmentSessionView]}>
            <Text
              style={styles.appointmentSessionHeaderText}
              testID="appointmentTypeAndTotalAppointmentsText"
              accessibilityLabel="appointmentTypeAndTotalAppointmentsText">
              {i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.APPOINTMENT_TYPE')}{' '}
              {this.state.no_appointments}
            </Text>
            {this.renderCheckBoxSection()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  toggleSwitch = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderSwitchSection = () => {
    return (
      <View style={[styles.screenPadding, styles.switchView]}>
        <View>
          <Text
            style={styles.switchText}
            testID="sameTimingsText"
            accessibilityLabel="sameTimingsText">
            {i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.SAME_TIMINGS')}
          </Text>
          {this.state.switch && (
            <Text
              style={styles.allDaysText}
              testID="monToSunText"
              accessibilityLabel="monToSunText">
              (Monday to Sunday)
            </Text>
          )}
        </View>
        <View style={[styles.flex, styles.itemsEnd]}>
          <Switch
            testID="chooseSwitch"
            accessibilityLabel="chooseSwitch"
            value={this.state.checkbox}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => this.toggleSwitch()}
          />
        </View>
      </View>
    );
  };

  closeModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      checkbox: false,
    }));
  };

  renderDaysCheckBox = text => {
    return (
      <View style={[styles.checkBoxAndTextView]}>
        <View
          style={[
            styles.flex,
            styles.flexDirectionRow,
            styles.checkBoxAndText,
          ]}>
          <CheckBox
            checked={true}
            style={styles.checkBox}
            isDisabled={true}
            testID={text + 'checkBox'}
            accessibilityLabel={text + 'checkBox'}
          />
          <Text
            style={styles.checkBoxText}
            testID={text + 'text'}
            accessibilityLabel={text + 'text'}>
            {text}
          </Text>
        </View>
      </View>
    );
  };

  saveSelectedDaysTimings = () => {
    //  need to add all same time to all days:

    const {session_timings, start_key, end_key} = this.state;
    const daysKeys = [
      'mon_start_time',
      'mon_end_time',
      'tue_start_time',
      'tue_end_time',
      'wed_start_time',
      'wed_end_time',
      'thu_start_time',
      'thu_end_time',
      'fri_start_time',
      'fri_end_time',
      'sat_start_time',
      'sat_end_time',
      'sun_start_time',
      'sun_end_time',
    ];

    daysKeys.forEach((element, index) => {
      if (index % 2 === 0) {
        session_timings[element] = session_timings[start_key];
      } else {
        session_timings[element] = session_timings[end_key];
      }
    });

    this.setState(prevState => ({
      session_timings: session_timings,
      modal: false,
      checkbox: true,
    }));
  };
  startDateModal = () => {
    const start_key = this.state.start_key;
    return (
      <DateTimePickerModal
        testID="dateTimePicker"
        accessibilityLabel="dateTimePicker"
        isVisible={true}
        mode={'time'}
        onConfirm={selectedDate =>
          // this.changeSelectedStartDate(selectedDate)
          this.updateTime(selectedDate, start_key)
        }
        onCancel={this.hidePicker}
      />
    );
  };
  endDateModal = () => {
    const end_key = this.state.end_key;
    return (
      <DateTimePickerModal
        testID="dateTimePicker"
        accessibilityLabel="dateTimePicker"
        isVisible={true}
        mode={'time'}
        onConfirm={selectedDate =>
          // this.changeSelectedStartDate(selectedDate)
          this.updateTime(selectedDate, end_key)
        }
        onCancel={this.hidePicker}
      />
    );
  };
  renderModal = () => {
    const {session_timings, start_key, end_key} = this.state;
    return (
      <Modal
        isVisible={this.state.modal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          {/* Hospital header and close Icon start */}
          <View style={styles.headerView}>
            <View style={[styles.flexDirectionRow, styles.hospitalViewMargin]}>
              <View style={styles.width95}>
                <Text
                  style={styles.modalHeaderText}
                  testID="startEndText"
                  accessibilityLabel="startEndText">
                  {i18n.t('MY_PRACTICES.PRACTICE_SETTINGS.START_END')}
                </Text>
              </View>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                testID="closeTouch"
                accessibilityLabel="closeTouch"
                style={styles.touchableArea}
                onPress={() => this.closeModal()}>
                <Close
                  height={15}
                  width={15}
                  style={styles.closeImage}
                  testID="closeImage"
                  accessibilityLabel="closeImage"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* session times */}
          <View style={styles.modalTimeSlotView}>
            <View style={styles.modalTimeView}>
              <Text
                style={styles.timeHeaderText}
                testID="startTimeText"
                accessibilityLabel="startTimeText">
                {i18n.t('MY_PRACTICES.EDIT_TIMINGS.START_TIME')}
              </Text>
              <Text
                style={styles.timeText}
                testID={convert24To12Hrs(session_timings[start_key]) + 'text'}
                accessibilityLabel={
                  convert24To12Hrs(session_timings[start_key]) + 'text'
                }>
                {convert24To12Hrs(session_timings[start_key])}
              </Text>
            </View>
            <View style={styles.filledArrowView}>
              <RightArrow
                height={20}
                width={20}
                testID="rightArrowText"
                accessibilityLabel="rightArrowText"
              />
            </View>
            <View style={styles.modalTimeView}>
              <Text
                style={styles.timeHeaderText}
                testID="endTimeText"
                accessibilityLabel="endTimeText">
                {i18n.t('MY_PRACTICES.EDIT_TIMINGS.END_TIME')}
              </Text>
              <Text
                style={styles.timeText}
                testID={convert24To12Hrs(session_timings[end_key]) + 'text'}
                accessibilityLabel={
                  convert24To12Hrs(session_timings[end_key]) + 'text'
                }>
                {convert24To12Hrs(session_timings[end_key])}
              </Text>
            </View>
          </View>

          {/* render days check box */}
          <View style={styles.daysCheckBoxView}>
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.MONDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.TUESDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.WEDNESDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.THURSDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.FRIDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.SATURDAY'),
            )}
            {this.renderDaysCheckBox(
              i18n.t('MY_PRACTICES.EDIT_TIMINGS.SUNDAY'),
            )}
          </View>
          <View style={styles.buttonView}>
            <Button
              testID="saveButton"
              accessibilityLabel="saveButton"
              style={styles.buttonStyles}
              onPress={() => this.saveSelectedDaysTimings()}>
              <Text
                style={styles.saveTextStyles}
                testID="saveText"
                accessibilityLabel="saveText">
                {i18n.t('MY_PRACTICES.EDIT_TIMINGS.SAVE')}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  saveSessionTimings = async () => {
    // try {
      const {
        session_timings,
        no_appointments,
        day,
        checkbox,
      } = this.state;
      const {t} = this.props;

      const {branch_id, weekly_timing_id} = session_timings;

      if (no_appointments) {
        session_timings.count = no_appointments;
      } else {
        Toast.show({
          text: i18n.t('MY_PRACTICES.ERRORS.APPOINTMENT_COUNT_ERROR'),
          type: 'warning',
          duration: 5000,
        });
        return;
      }
      if (day) {
        session_timings.day = day.toLowerCase();
      } else {
        Toast.show({
          text: i18n.t('MY_PRACTICES.ERRORS.SESSION_DAY_ERROR'),
          type: 'warning',
          duration: 5000,
        });
        return;
      }
      // this.state.appt_type_count.map((element,index)=>{
      //   this.handleAppointmentsTextAlert(element)
      // })
      const doctor_id = await AsyncStorage.getItem('doctorid');
      const payload = []
      const payload1 = []
      let payload_flag=false
      this.state.appt_type.map((element,index) =>{
        if(this.state.no_appointments<this.state.appt_type_count[element?.appointment_type_value+'_count']){
          payload_flag=true
        }else{
          payload[index]={appointment_type: element?.appointment_type_value, value: this.state.appt_type_count[element?.appointment_type_value+'_count'], max_count: this.state.no_appointments, day: day.toLowerCase()}
        }
      })
      if(payload_flag){
        Toast.show({
          text: i18n.t('MY_PRACTICES.ERRORS.APPOINTMENT_VALUE_ERROR') + ' ' + this.state.no_appointments,
          type: 'warning',
          duration: 5000,
        });
        return;
      }else{
      let ob2={}
      if(this.state.checkbox){
        const weekdayShort = ['mon','tue','wed','thu','fri','sat','sun']
        weekdayShort.map((element,index)=>{
          ob2['appt_limits']=payload
          ob2['specialization']=session_timings?.doc_work_timing?.specialization
          ob2[element+'_start_time']=session_timings[element+'_start_time']
          ob2[element+'_end_time']=session_timings[element+'_end_time']  
        })  
      }else{
      const weekday=day.toString().slice(0,3).toLowerCase()
      let start_time1=weekday+'_start_time'
      let end_time1=weekday+'_end_time'
      ob2['appt_limits']=payload
      ob2['specialization']=session_timings?.doc_work_timing?.specialization
      ob2[start_time1]=session_timings[start_time1]
      ob2[end_time1]=session_timings[end_time1]
    }
    console.log("ob",ob2)
      const response = await updateSessionTimings(
        doctor_id,
        branch_id,
        weekly_timing_id,
        ob2,
      );
      if (response) {
        if (checkbox) {
          Toast.show({
            text: i18n.t('MY_PRACTICES.ERRORS.WEEKLY_TIMINGS_SUCCESS_MESSAGE'),
            type: 'success',
            duration: 5000,
          });
        } else {
          Toast.show({
            text:
              nameConversion(day) +
              ' ' +
              i18n.t('MY_PRACTICES.ERRORS.TIMINGS_UPDATED'),
            type: 'success',
            duration: 5000,
          });
        }
      }}
    //  }catch (error) {
    //   Toast.show({
    //     // text: i18n.t('MY_PRACTICES.ERRORS.WEEKLY_TIMINGS_ERROR_MESSAGE'),
    //     text: error.response.data.message,
    //     type: 'danger',
    //     duration: 5000,
    //   });
    //   throw error;
    // }
  };

  render() {
    if (this.state.loader) {
      return <AppLoader />;
    }
    return (
      <Container>
        <ScrollView>
          <View style={styles.wrapper}>
            <View style={[styles.screenPadding, styles.sessionTimings]}>
              <Text
                style={styles.sessionTimeText}
                testID="sessionTimeText"
                accessibilityLabel="sessionTimeText">
                {i18n.t('MY_PRACTICES.EDIT_TIMINGS.SESSION_TIME')}
              </Text>
              {/*  session */}
              {/* {this.renderStartTimeSection()}
              {this.renderHorizontalLine()}
              {this.renderEndTimeSection()} */}
              {this.renderStartEndTime()}
            </View>
            {/* appointment for session section start */}
            {this.renderAppointmentsForSession()}
            {this.renderSwitchSection()}
          </View>
        </ScrollView>
        {this.state.modal && this.renderModal()}
        {this.state.startTime && this.startDateModal()}
        {this.state.endTime && this.endDateModal()}
        <Footer
          style={[
            styles.screenPadding,
            styles.footerMargin,
            styles.footerStyles,
          ]}>
          <Button
            style={styles.saveButtonStyles}
            onPress={() => this.saveSessionTimings()}
            testID="saveButton"
            accessibilityLabel="saveButton">
            <Text
              style={styles.saveTextStyles}
              testID="saveText"
              accessibilityLabel="saveText">
              {i18n.t('MY_PRACTICES.EDIT_TIMINGS.SAVE')}
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

export default withTranslation()(EditTimings);
