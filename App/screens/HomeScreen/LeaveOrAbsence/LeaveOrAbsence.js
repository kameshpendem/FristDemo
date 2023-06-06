import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Container, Footer, Button, Toast} from 'native-base';
import Modal from 'react-native-modal';
import axios from 'axios';

// STYLES
import styles from './LeaveOrAbsenceStyles';

// images
import DropDownArrow from '../../../assets/images/drop_arrow_filled.svg';
import Close from '../../../assets/images/close.svg';
import {leaveAbsenceValidations} from '../../../utils/LeaveAbsenceValidations';
import AsyncStorage from '@react-native-community/async-storage';

import {
  dateYYYYMMDD,
  timeHHMM,
  timeHHMMSS,
} from '../CovidMonitoring/Utils/DateTimeUtil';

// constants

import {leaveAndAbsenceState} from '../MyPractice/Constants';

// services
import {
  createAppointments,
  cancelAppointments,
  getDoctorAvailableSlots,
  rescheduleDoctorAppointment,
} from '../../../services/MyPracticeService';

// components
import AppLoader from '../Common/AppLoader';
import {DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

class LeaveOrAbsence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from_date: '',
      from_time: '',
      to_date: '',
      to_time: '',
      datePicker: false,
      timePicker: false,
      selected_date: '',
      selected_time: '',
      change_from_date: '',
      change_to_date: '',
      change_from_time: '',
      change_to_time: '',
      modal: false,
      leave_type_key: '',
      leave_type: '',
      alert_flag: false,
      reason: '',
      contact: '',
      appointments: [],
      buttonLoader: false,
      cancelAppointmentLoader: false,
      pickermode: false,
    };
  }

  onDateChange(event, selectedDate) {
    const selected_date = this.state.selected_date;
    const from_date = this.state.from_date;
    const to_date = this.state.to_date;
    const change_from_date = this.state.change_from_date;
    const change_to_date = this.state.change_to_date;

    if (event.type === 'dismissed') {
      this.setState({datePicker: false});
      return;
    }

    this.setState({
      datePicker: false,
      from_date:
        selected_date === 'from_date'
          ? selectedDate
          : from_date
          ? from_date
          : '',

      to_date:
        selected_date === 'to_date' ? selectedDate : to_date ? to_date : '',
      change_from_date:
        selected_date === 'change_from_date'
          ? selectedDate
          : change_from_date
          ? change_from_date
          : '',
      change_to_date:
        selected_date === 'change_to_date'
          ? selectedDate
          : change_to_date
          ? change_to_date
          : '',
    });
  }
  hidePicker = () => {
    this.setState({pickermode: false});
  };
  onTimeChangeIos(selectedDate) {
    const selected_time = this.state.selected_time;
    const from_time = this.state.from_time;
    const to_time = this.state.to_time;
    const change_from_time = this.state.change_from_time;
    const change_to_time = this.state.change_to_time;
    this.setState({
      timePicker: false,
      pickermode: false,
      from_time:
        selected_time === 'from_time'
          ? selectedDate
          : from_time
          ? from_time
          : '',

      to_time:
        selected_time === 'to_time' ? selectedDate : to_time ? to_time : '',
      change_from_time:
        selected_time === 'change_from_time'
          ? selectedDate
          : change_from_time
          ? change_from_time
          : '',

      change_to_time:
        selected_time === 'change_to_time'
          ? selectedDate
          : change_to_time
          ? change_to_time
          : '',
    });
  }
  onTimeChange(event, selectedDate) {
    const selected_time = this.state.selected_time;
    const from_time = this.state.from_time;
    const to_time = this.state.to_time;
    const change_from_time = this.state.change_from_time;
    const change_to_time = this.state.change_to_time;

    if (event.type === 'dismissed') {
      this.setState({timePicker: false, pickermode: false});
      return;
    }
    this.setState({
      timePicker: false,
      pickermode: false,
      from_time:
        selected_time === 'from_time'
          ? selectedDate
          : from_time
          ? from_time
          : '',

      to_time:
        selected_time === 'to_time' ? selectedDate : to_time ? to_time : '',
      change_from_time:
        selected_time === 'change_from_time'
          ? selectedDate
          : change_from_time
          ? change_from_time
          : '',

      change_to_time:
        selected_time === 'change_to_time'
          ? selectedDate
          : change_to_time
          ? change_to_time
          : '',
    });
  }

  renderSelectPracticeAndBranch = () => {
    const {t} = this.props;

    return (
      <View style={styles.selectPracticeAndBranchMainView}>
        <View style={[styles.selectPracticeMainView]}>
          <TouchableOpacity
            style={[
              styles.flex,
              styles.flexDirectionRow,
              styles.filledArrowView,
            ]}>
            <View style={styles.width90}>
              <Text numberOfLines={1} style={styles.practiceAndBranchStyles}>
                {t('ABSENCE_LEAVE.SELECT_PRACTICE')}
              </Text>
            </View>
            <View style={[styles.flex, styles.filledArrowView]}>
              <DropDownArrow />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.selectBranchMainView}>
          <TouchableOpacity
            style={[styles.flexDirectionRow, styles.filledArrowView]}>
            <View style={styles.width90}>
              <Text numberOfLines={1} style={styles.practiceAndBranchStyles}>
                {t('ABSENCE_LEAVE.SELECT_BRANCH')}
              </Text>
            </View>

            <View style={[styles.flex, styles.filledArrowView]}>
              <DropDownArrow />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderLeaveTypeModal = () => {
    const {t} = this.props;
    return (
      <View>
        <Text
          style={styles.leaveTypeHeading}
          testID="leaveTypeText"
          accessibilityLabel="leaveTypeText">
          {t('ABSENCE_LEAVE.LEAVE_TYPE')}
        </Text>
        <View style={styles.selectLeaveTypeView}>
          <TouchableOpacity
            style={[styles.flex, styles.flexDirectionRow]}
            onPress={() => this.closeModal()}>
            <Text
              style={styles.leaveTypeText}
              testID="selectLeaveTypeText"
              accessibilityLabel="selectLeaveTypeText">
              {this.state.leave_type !== ''
                ? this.state.leave_type
                : t('ABSENCE_LEAVE.SELECT_LEAVE_TYPE')}
            </Text>
            <View
              style={[
                styles.flex,
                styles.itemsEnd,
                styles.dropDownArrowOpacity,
              ]}>
              <DropDownArrow
                style={styles.dropDownArrowOpacity}
                testID="selectDropDown"
                accessibilityLabel="selectDropDown"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  enableDatePicker = date => {
    this.setState(prevState => ({
      datePicker: !prevState.datePicker,
      selected_date: date,
    }));
  };

  showDateToaster = text => {
    Toast.show({
      text: text,
      type: 'danger',
      duration: 3000,
    });
  };

  enableTimePicker = time => {
    this.setState(prevState => ({
      timePicker: !prevState.timePicker,
      pickermode: !prevState.pickermode,
      selected_time: time,
    }));
  };

  handleReason = text => {
    this.setState({
      reason: text,
    });
  };

  handleContactDetails = text => {
    this.setState({
      contact: text,
    });
  };

  renderReasonAndContactDetails = () => {
    const {t} = this.props;
    return (
      <KeyboardAvoidingView
      behavior={"padding" }
      onPress={Keyboard.dismiss}>
      <View style={[styles.formSectionPadding, styles.paddingTop0]}>
        <Text
          style={styles.leaveTypeHeading}
          testID="reasonText"
          accessibilityLabel="reasonText">
          {t('ABSENCE_LEAVE.REASON')}
        </Text>
        <TextInput
          style={styles.reasonTextInput}
          multiline={true}
          onChangeText={text => this.handleReason(text)}
          defaultValue={this.state.reason}
        />
        <Text
          style={styles.leaveTypeHeading}
          testID="contactDetailsText"
          accessibilityLabel="contactDetailsText">
          {t('ABSENCE_LEAVE.CONTACT_DETAILS')}
        </Text>
        <TextInput
          testID="contactDetailsTextInput"
          accessibilityLabel="contactDetailsTextInput"
          style={styles.contactDetailsTextInput}
          multiline={true}
          onChangeText={text => this.handleContactDetails(text)}
          defaultValue={this.state.contact}
        />
      </View>
      {/* {(img.length==index+1)&&( */}
      <View style={{height:Platform.OS=='ios'?100:0}}></View>
    {/* )} */}
      </KeyboardAvoidingView>
    );
  };

  leaveTypeDates = dateType => {
    const {t} = this.props;
    if (dateType === 'to_date') {
      this.state.from_date
        ? this.enableDatePicker(dateType)
        : this.showDateToaster(t('ABSENCE_LEAVE.PLEASE_SELECT_FROM_DATE'));
    } else if (dateType === 'from_date') {
      this.state.leave_type_key
        ? this.enableDatePicker(dateType)
        : this.showDateToaster(t('ABSENCE_LEAVE.PLEASE_SELECT_LEAVE_TYPE'));
    } else {
      this.enableDatePicker(dateType);
    }
  };

  renderFormDateAndTime = (heading, subHeading, date, time, testID) => {
    const state = this.state;
    const {t} = this.props;
    return (
      <View style={[styles.timeDateMainView, styles.marginBottom10]}>
        {/* from Date */}
        <View style={[styles.flex, styles.marginRight15]}>
          <Text
            style={styles.leaveTypeHeading}
            testID={testID}
            accessibilityLabel={testID}>
            {heading}
          </Text>
          <View style={styles.selectDateView}>
            <TouchableOpacity onPress={() => this.leaveTypeDates(date)}>
              <Text
                style={styles.dateTex}
                testID="fromSelectDateText"
                accessibilityLabel="fromSelectDateText">
                {state[date] === '' || state[date] === undefined
                  ? t('ABSENCE_LEAVE.SELECT_DATE')
                  : moment(state[date]).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* From Time */}
        <View style={[styles.flex, styles.marginLeft15]}>
          <Text style={styles.leaveTypeHeading}>{subHeading}</Text>
          <View style={styles.selectDateView}>
            <TouchableOpacity onPress={() => this.enableTimePicker(time)}>
              <Text
                style={styles.dateTex}
                testID="fromSelectTimeText"
                accessibilityLabel="fromSelectTimeText">
                {state[time] === '' || state[time] === undefined
                  ? t('ABSENCE_LEAVE.SELECT_TIME')
                  : moment(state[time]).format('LT')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderChangeTimeSection = () => {
    const state = this.state;
    const {t} = this.props;
    return (
      <View>
        <View
          style={[
            styles.screenPadding,
            styles.marginTop15,
            styles.marginBottom8,
          ]}>
          <Text
            style={styles.leaveTypeHeading}
            testID="fromDateText"
            accessibilityLabel="fromDateText">
            {t('ABSENCE_LEAVE.FROM_DATE')}
          </Text>
          <View style={styles.selectDateView}>
            <TouchableOpacity
              onPress={() =>
                this.state.leave_type_key
                  ? this.enableDatePicker('change_from_date')
                  : this.showDateToaster(
                      t('ABSENCE_LEAVE.PLEASE_SELECT_LEAVE_TYPE'),
                    )
              }
              testID="selectLeaveTypeTouch"
              accessibilityLabel="selectLeaveTypeTouch">
              <Text
                style={styles.dateTex}
                testID="selectDateText"
                accessibilityLabel="selectDateText">
                {state.change_from_date === '' ||
                state.change_from_date === undefined
                  ? t('ABSENCE_LEAVE.SELECT_DATE')
                  : moment(state.change_from_date).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.screenPadding,
            styles.marginTop10,
            styles.marginBottom8,
          ]}>
          <Text
            style={styles.leaveTypeHeading}
            testID="toDateText"
            accessibilityLabel="toDateText">
            {t('ABSENCE_LEAVE.TO_DATE')}
          </Text>
          <View style={styles.selectDateView}>
            <TouchableOpacity
              onPress={() =>
                this.state.change_from_date
                  ? this.enableDatePicker('change_to_date')
                  : this.showDateToaster(
                      t('ABSENCE_LEAVE.PLEASE_SELECT_TO_DATE'),
                    )
              }
              testID="selectToDateText"
              accessibilityLabel="selectToDateText">
              <Text style={styles.dateTex}>
                {state.change_to_date === '' ||
                state.change_to_date === undefined
                  ? t('ABSENCE_LEAVE.SELECT_DATE')
                  : moment(state.change_to_date).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.timeDateMainView,
            styles.screenPadding,
            styles.marginBottom8,
          ]}>
          {/* from Date */}
          <View
            style={[styles.flex, styles.marginRight15, styles.marginBottom8]}>
            <Text
              style={styles.leaveTypeHeading}
              testID="availableTimesText"
              accessibilityLabel="availableTimesText">
              {t('ABSENCE_LEAVE.AVAILABLE_TIMES')}
            </Text>
            <View style={styles.selectDateView}>
              <TouchableOpacity
                onPress={() => this.enableTimePicker('change_from_time')}>
                <Text
                  style={styles.dateTex}
                  testID="fromTimeText"
                  accessibilityLabel="fromTimeText">
                  {state.change_from_time === '' ||
                  state.change_from_time === undefined
                    ? t('ABSENCE_LEAVE.FROM_TIME')
                    : moment(state.change_from_time).format('LT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* From Time */}
          <View style={[styles.flex, styles.marginLeft15]}>
            <Text style={styles.leaveTypeHeading}></Text>
            <View style={styles.selectDateView}>
              s
              <TouchableOpacity
                onPress={() => this.enableTimePicker('change_to_time')}>
                <Text
                  style={styles.dateTex}
                  testID="toTimeText"
                  accessibilityLabel="toTimeText">
                  {state.change_to_time === '' ||
                  state.change_to_time === undefined
                    ? t('ABSENCE_LEAVE.TO_TIME')
                    : moment(state.change_to_time).format('LT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderLeaveAndAbsenceForm = () => {
    const {t} = this.props;
    return (
      <View style={[styles.formSectionPadding]}>
        {this.renderFormDateAndTime(
          t('ABSENCE_LEAVE.FROM_DATE'),
          t('ABSENCE_LEAVE.TIME'),
          'from_date',
          'from_time',
          'fromDateText',
        )}
        {this.renderFormDateAndTime(
          t('ABSENCE_LEAVE.TO_DATE'),
          t('ABSENCE_LEAVE.TIME'),
          'to_date',
          'to_time',
          'toDateText',
        )}
      </View>
    );
  };

  closeModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  updateLeaveType = (text, key) => {
    this.setState(prevState => ({
      leave_type: text,
      modal: !prevState.modal,
      leave_type_key: key,
    }));
  };
  renderLeaveTypes = (text, key, testID) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.leaveTypeTouchableArea}
          onPress={() => this.updateLeaveType(text, key)}>
          <Text
            style={styles.leaveTypesText}
            testID={testID}
            accessibilityLabel={testID}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderModal = () => {
    const {t} = this.props;
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
                  testID="selectLeaveTypeText"
                  accessibilityLabel="selectLeaveTypeText">
                  {t('ABSENCE_LEAVE.SELECT_LEAVE_TYPE')}
                </Text>
              </View>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={styles.touchableArea}
                onPress={() => this.closeModal()}>
                <Close
                  height={15}
                  width={15}
                  style={styles.closeImage}
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* leave types  */}
          {this.renderLeaveTypes(
            t('ABSENCE_LEAVE.LEAVE_OR_ABSENCE'),
            'leave_absence',
            'leaveOrAbsenseText',
          )}
          {this.renderLeaveTypes(
            t('ABSENCE_LEAVE.CHANGE_OF_TIME'),
            'change_of_time',
            'changeOfTimeText',
          )}
        </View>
      </Modal>
    );
  };

  validateLeaveAbsenceForm = async () => {
    const {t} = this.props;
    try {
      const doctor_id = await AsyncStorage.getItem('doctorid');

      const state = this.state;

      const {
        leave_type,
        leave_type_key,
        change_from_date,
        change_to_date,
        change_from_time,
        change_to_time,
        from_date,
        to_date,
        from_time,
        to_time,
        contact,
        reason,
      } = state;

      const validateMessage = leaveAbsenceValidations(state);
      if (validateMessage) {
        Toast.show({
          text: validateMessage || t('ABSENCE_LEAVE.FORM_FILL'),
          type: 'danger',
          duration: 3000,
        });
      } else {
        const payload = {
          doctor_id: doctor_id,
          reason: reason,
          contact_details: contact,
          leave_type:
            leave_type_key === 'change_of_time'
              ? 'Change Of Time'
              : 'Leave / Absence',
        };

        if (leave_type_key === 'change_of_time') {
          payload.from_date = dateYYYYMMDD(change_from_date);
          payload.to_date = dateYYYYMMDD(change_to_date);
          payload.from_time = timeHHMM(change_from_time);
          payload.to_time = timeHHMM(change_to_time);
        } else if (leave_type_key === 'leave_absence') {
          payload.from_date = dateYYYYMMDD(from_date);
          payload.to_date = dateYYYYMMDD(to_date);
          payload.from_time = timeHHMM(from_time);
          payload.to_time = timeHHMM(to_time);
        }
        const response = await createAppointments(payload);

        if (
          response &&
          response?.data &&
          response?.data?.appointments &&
          response?.data?.appointments?.length === 0
        ) {
          this.setState({
            appointments: [],
            ...leaveAndAbsenceState,
          });
          Toast.show({
            text: response?.data?.message || t('ABSENCE_LEAVE.LEAVE_CREATED'),
            type: 'success',
            duration: 3000,
          });
        } else if (
          response &&
          response?.data &&
          response?.data?.appointments &&
          response?.data?.appointments?.length > 0
        ) {
          this.setState(prevState => ({
            alert_flag: !prevState.alert_flag,
            appointments: response?.data?.appointments,
          }));
        }
      }
    } catch (error) {
      Toast.show({
        text: t('ABSENCE_LEAVE.LEAVE_EXIST'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  cancelAppointments = async () => {
    try {
      const {appointments} = this.state;
      const {t} = this.props;

      this.setState({
        cancelAppointmentLoader: true,
      });
      const doctor_id = await AsyncStorage.getItem('doctorid');

      for (const element of appointments) {
        const payload = {
          doc_id: doctor_id,
          hlp: element.healpha_id,
          st: element.date_start,
          end: element.date_end,
          dat: dateYYYYMMDD(element.date_start),
          cancel_description: element.description,
        };
        await cancelAppointments(payload);
      }

      this.setState(prevState => ({
        alert_flag: !prevState.alert_flag,
        cancelAppointmentLoader: false,
        ...leaveAndAbsenceState,
      }));

      Toast.show({
        text: t('ABSENCE_LEAVE.CANCEL_SUCCESS'),
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      Toast.show({
        text: t('ABSENCE_LEAVE.CANCEL_APPOINTMENT_FAILED'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  changeDoctorAppointments = async date => {
    let all_slots = [];
    const response = await getDoctorAvailableSlots(date, '', '');
    const free_slots = response?.data?.free_slots;

    let morning_slots = [];
    let afternoon_slots = [];
    let evening_slots = [];

    if (free_slots?.morning && free_slots?.morning?.length > 0) {
      morning_slots = free_slots?.morning;
    } else if (free_slots?.afternoon && free_slots?.afternoon?.length > 0) {
      afternoon_slots = free_slots?.afternoon;
    } else if (free_slots?.evening && free_slots?.evening?.length > 0) {
      evening_slots = free_slots?.evening;
    }

    all_slots = morning_slots.concat(afternoon_slots.concat(evening_slots));
    return all_slots;
  };

  rescheduleAppointments = async () => {
    try {
      this.setState({
        buttonLoader: true,
      });

      const doctor_id = await AsyncStorage.getItem('doctorid');
      const branchId = await AsyncStorage.getItem('branch_id');
      const {t} = this.props;

      const slot_timings = await AsyncStorage.getItem('slot_timing');

      const {leave_type_key, change_to_date, to_date, appointments} =
        this.state;

      let date = '';
      let all_slots = [];
      if (leave_type_key === 'change_of_time') {
        date = new Date(change_to_date);
      } else if (leave_type_key === 'leave_absence') {
        date = new Date(to_date);
      }
      for (const element of appointments) {
        const payload = {
          hlp: element.healpha_id,
          originalStartTime: element.date_start,
          dat: dateYYYYMMDD(element.date_start),
          originalEndTime: element.date_end,
          doc_id: element.doc_id,
          br_id: element.branch_id,
          br_name: element?.branch_details?.branch_name || '',
          uid:
            element.healpha_id +
            ':' +
            dateYYYYMMDD(element.date_start) +
            ':' +
            element.doc_id +
            ':' +
            timeHHMMSS(element.date_start),
          app_type: element.appointment_type,
        };

        const max = Number.MAX_SAFE_INTEGER;
        let j = 0;
        const new_date = new Date(date);

        while (j < max) {
          new_date.setDate(new_date.getDate() + j);
          const response = await getDoctorAvailableSlots(
            moment(new_date).format('YYYY-MM-DD'),
            doctor_id,
            branchId,
          );
          const free_slots = response?.data?.free_slots;
          let morning_slots = [];
          let afternoon_slots = [];
          let evening_slots = [];

          if (free_slots?.morning && free_slots?.morning?.length > 0) {
            morning_slots = free_slots?.morning;
          } else if (
            free_slots?.afternoon &&
            free_slots?.afternoon?.length > 0
          ) {
            afternoon_slots = free_slots?.afternoon;
          } else if (free_slots?.evening && free_slots?.evening?.length > 0) {
            evening_slots = free_slots?.evening;
          }

          all_slots = morning_slots.concat(
            afternoon_slots.concat(evening_slots),
          );
          if (all_slots.length > 0) {
            break;
          } else {
            j++;
          }
        }

        if (all_slots.length > 0) {
          const appointment = all_slots[0];
          const slots_date = new Date(new_date);
          const slot_times = appointment.value;
          const splits = slot_times.split(':');

          let start_time = slots_date.setHours(
            parseInt(splits[0]),
            parseInt(splits[1]),
            0,
            0,
          );
          let end_time = slots_date.setMinutes(
            slots_date.getMinutes() + parseInt(slot_timings),
          );
          start_time = new Date(start_time);
          end_time = new Date(end_time);
          payload.orig_date = dateYYYYMMDD(start_time);

          payload.rescheduledStartTime =
            dateYYYYMMDD(start_time) + ' ' + timeHHMMSS(start_time);
          payload.rescheduledEndTime =
            dateYYYYMMDD(end_time) + ' ' + timeHHMMSS(end_time);
          await rescheduleDoctorAppointment(payload);
        }
      }
      this.setState({
        buttonLoader: false,
        alert_flag: false,
        ...leaveAndAbsenceState,
      });
      Toast.show({
        text: t('ABSENCE_LEAVE.RESCHEDULE_SUCCESS'),
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      Toast.show({
        text: t('ABSENCE_LEAVE.RESCHEDULE_ERROR'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  closeWarningModal = () => {
    this.setState({
      alert_flag: false,
    });
  };

  renderWaringModal = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.alert_flag}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeWarningModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          {/* Hospital header and close Icon start */}
          <View style={styles.headerView}>
            <View style={[styles.flexDirectionRow, styles.hospitalViewMargin]}>
              <View style={styles.width95}>
                <Text
                  style={styles.modalHeaderText}
                  testID="rescheduleOrCanceLBookedAppointmentsForAppliedDatesText"
                  accessibilityLabel="rescheduleOrCanceLBookedAppointmentsForAppliedDatesText">
                  {t('ABSENCE_LEAVE.RESCHEDULE_CANCEL_APPLY_DATE')}
                </Text>
              </View>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={styles.touchableArea}
                onPress={() => this.closeWarningModal()}>
                <Close
                  height={15}
                  width={15}
                  style={styles.closeImage}
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* leave types  */}

          <View style={styles.flexDirectionRow}>
            <Button
              style={styles.scheduleButton}
              onPress={() => this.rescheduleAppointments()}>
              {this.state.buttonLoader ? (
                <AppLoader size={'small'} color={DEFAULT_WHITE_COLOR} />
              ) : (
                <Text
                  style={styles.buttonsText}
                  testID="rescheduleText"
                  accessibilityLabel="rescheduleText">
                  {t('ABSENCE_LEAVE.RESCHEDULE')}
                </Text>
              )}
            </Button>
            <Button
              style={styles.cancelButton}
              onPress={() => this.cancelAppointments()}
              testID="cancelAppointmentButton"
              accessibilityLabel="cancelAppointmentButton">
              {this.state.cancelAppointmentLoader ? (
                <AppLoader size={'small'} color={DEFAULT_WHITE_COLOR} />
              ) : (
                <Text
                  style={styles.buttonsText}
                  testID="cancelAppointmentText"
                  accessibilityLabel="cancelAppointmentText">
                  {t('ABSENCE_LEAVE.CANCEL_APPOINTMENTS')}
                </Text>
              )}
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  navigateToLeavesAbsenceHistory = () => {
    this.props.navigation.navigate('LeaveOrAbsenceHistory');
  };

  render() {
    const {t} = this.props;
    return (
      <Container>
        <ScrollView>
          <View style={[styles.wrapper]}>
            {/* select practice and Branch sections */}
            {/* {this.renderSelectPracticeAndBranch()} */}
            <View style={[styles.formSectionPadding, styles.paddingBottom0]}>
              {this.renderLeaveTypeModal()}
            </View>
            {this.state.leave_type_key === 'change_of_time'
              ? this.renderChangeTimeSection()
              : this.renderLeaveAndAbsenceForm()}

            {this.renderReasonAndContactDetails()}

            <View style={[styles.screenPadding, styles.paddingBottom]}>
              <Text
                style={styles.previousHistoryText}
                testID="previousLeavesAndAbsenseHistoryText"
                accessibilityLabel="previousLeavesAndAbsenseHistoryText">
                {t('ABSENCE_LEAVE.HISTORY')}
              </Text>
              <Text
                style={styles.clickHereText}
                onPress={() => this.navigateToLeavesAbsenceHistory()}
                testID="clickHereText"
                accessibilityLabel="clickHereText">
                {t('ABSENCE_LEAVE.CLICK_HERE')}
              </Text>
            </View>

            {this.state.datePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                accessibilityLabel="dateTimePicker"
                value={new Date()}
                display="default"
                mode={'date'}
                onChange={(event, date) => this.onDateChange(event, date)}
                minimumDate={
                  this.state.leave_type_key === 'leave_absence'
                    ? this.state.from_date
                      ? new Date(this.state.from_date)
                      : new Date()
                    : this.state.change_from_date
                    ? new Date(this.state.change_from_date)
                    : new Date()
                }
              />
            )}

            {this.state.timePicker ? (
              Platform.OS == 'android' ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  accessibilityLabel="dateTimePicker"
                  value={new Date()}
                  display="default"
                  onChange={(event, date) => this.onTimeChange(event, date)}
                  mode={'time'}
                  minimumDate={new Date()}
                />
              ) : (
                <DateTimePickerModal
                  isVisible={this.state.pickermode}
                  mode={'time'}
                  is24Hour
                  onConfirm={selectedDate => this.onTimeChangeIos(selectedDate)}
                  onCancel={() => this.hidePicker()}
                />
              )
            ) : null}
            {/* )} */}
          </View>
          {this.state.modal && this.renderModal()}

          {this.state.alert_flag && this.renderWaringModal()}
        </ScrollView>
        <Footer style={styles.footerBackgroundColor}>
          <Button
            testID="saveButton"
            accessibilityLabel="saveButton"
            style={[
              styles.itemsCenter,
              styles.flex,
              styles.elevation,
              styles.saveButton,
            ]}
            onPress={() => this.validateLeaveAbsenceForm()}>
            <Text
              style={styles.saveText}
              testID="saveText"
              accessibilityLabel="saveText">
              {t('ABSENCE_LEAVE.SAVE')}
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

export default withTranslation()(LeaveOrAbsence);
