import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import {Toast} from 'native-base';

// styles
import styles from './DoctorTimingsStyles';

// utils and constants
import {dummyJson} from '../Constants';
import {nameConversion} from '../../../../utils/NameConversion';

// services
import {getSessionsOfBranch} from '../../../../services/MyPracticeService';
import {convert24To12Hrs} from '../../CovidMonitoring/Utils/DateTimeUtil';
import i18n from '../../../../../i18n';

class DoctorTimings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timings: dummyJson.timings,
      branch_id: '',
      sessions: [],
      slot_timing: '',
      stand_alone: 0,
      init: true,
    };
  }

  componentDidMount() {
    const {branch_id, slot_timing, stand_alone} =
      this.props?.navigation?.state?.params;
    this.props.navigation.addListener('willFocus', this._handleStateChange);
    this.setState(
      {
        branch_id: branch_id,
        slot_timing: slot_timing,
        stand_alone: stand_alone,
      },
      () => this.init(),
    );
  }

  componentWillUnmount() {
    // this.props.onRef(null);
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    this.init();
  };

  init = async () => {
    const {t} = this.props;

    try {
      const branch_id = this.state.branch_id;
      const doctor_id = await AsyncStorage.getItem('doctorid');
      const response = await getSessionsOfBranch(doctor_id, branch_id);
      if (response && response?.data) {
        this.setState({
          sessions: response.data.session_timings,
        });
      }
    } catch (error) {
      Toast.show({
        text:
          error?.message ||
          t('MY_PRACTICES.ERRORS.BRANCH_SESSION_TIMINGS_ERROR'),
        type: 'danger',
        duration: 5000,
      });
      throw error;
    }
  };
  renderSessionHeaders = (element, index) => {
    const {t} = this.props;
    return (
      <View style={[styles.flex, styles.itemsCenter]}>
        <Text style={styles.headingText}
        testID={"session"+index}
        accessibilityLabel={"session"+index}>
          {t('MY_PRACTICES.EDIT_TIMINGS.SESSION') + index}
        </Text>
      </View>
    );
  };

  renderHeaders = () => {
    const {t} = this.props;
    const sessions = this.state.sessions;
    return (
      <View
        style={[
          styles.screenPadding,
          styles.viewBottomBorder,
          styles.flexDirectionRow,
          styles.backgroundColor,
        ]}>
        <View style={styles.width20}>
          <Text style={styles.headingText}
          testID="dayText"
          accessibilityLabel="dayText">
            {t('MY_PRACTICES.EDIT_TIMINGS.DAY')}
          </Text>
        </View>

        {sessions?.length > 0 &&
          sessions.map((element, index) =>
            this.renderSessionHeaders(element, index + 1),
          )}
      </View>
    );
  };

  navigateToEditTimings = async (element, session, day, start_key, end_key) => {
    const params = {
      session_timings: element,
      session: session,
      title: 'Edit Timings' + ' ' + day + ' ' + nameConversion(session),
      start_key,
      end_key,
      slot_timing: this.state.slot_timing,
      day: day,
      session_id: element.session_id,
      branch_id: this.state.branch_id
    };
    this.props.navigation.navigate('EditTimings', params);
    // KEEP COMMENTED CODE FOR FUTURE REFERENCE.
    // const {stand_alone} = this.state;
    // const role = await AsyncStorage.getItem('role');
    // const {t} = this.props;
    // if (
    //   stand_alone === 1 ||
    //   role.toLowerCase() === 'practice' ||
    //   role.toLowerCase() === 'execution team'
    // ) {
    // } else {
    //   Toast.show({
    //     text: t('MY_PRACTICES.ERRORS.EDIT_SESSION_USER_ERROR'),
    //     type: 'danger',
    //     duration: 5000,
    //   });
    // }
  };

  renderSessionTimings = (element, index, day, start_key, end_key) => {
    let start_val = convert24To12Hrs(element[start_key]);
    let end_val = convert24To12Hrs(element[end_key]);
    const {t} = this.props;
    return (
      <View style={[styles.flex, styles.itemsCenter]}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() =>
            this.navigateToEditTimings(
              element,
              'session' + index,
              day,
              start_key,
              end_key,
            )
          }
          testID={{start_val} - {end_val}+"touch"}
          accessibilityLabel={{start_val} - {end_val}+"touch"}>
          {start_val && end_val ? (
            <Text
              style={[styles.headingText, styles.itemsCenter, styles.timeText]}
              testID={{start_val} - {end_val}+"text"}
              accessibilityLabel={{start_val} - {end_val}+"text"}>
              {start_val} - {end_val}
            </Text>
          ) : null}

          {start_val && end_val ? (
            <Text style={styles.visitTypeText}
            testID="inPersonText"
            accessibilityLabel="inPersonText">
              {t('MY_PRACTICES.EDIT_TIMINGS.IN_PERSON_VISIT')}
            </Text>
          ) : (
            <Text>{'-'}</Text>
          )}

          {start_val && end_val ? (
            <Text style={styles.visitTypeText}
            testID="remoteVisitText"
            accessibilityLabel="remoteVisitText">
              {t('MY_PRACTICES.EDIT_TIMINGS.REMOTE_VISIT')}
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  renderTimings = (day, start_key, end_key) => {
    const sessions = this.state.sessions;
    return (
      <View
        style={[
          styles.screenPadding,
          styles.flexDirectionRow,
          styles.backgroundColor,
          styles.timingViewPaddings,
          styles.viewBorder,
          styles.timingsViewMargin,
        ]}>
        <View style={styles.width20}>
          <Text style={styles.dayAndTimeTextStyles}
          testID={day+"text"}
          accessibilityLabel={day+"text"}>{day}</Text>
        </View>

        {sessions?.length > 0 &&
          sessions.map((object, index) =>
            this.renderSessionTimings(
              object,
              index + 1,
              day,
              start_key,
              end_key,
            ),
          )}
      </View>
    );
  };

  render() {
    const sessions = this.state.sessions;

    return (
      <View style={[styles.wrapper]}>
        <ScrollView style={{flex: 1}}>
          {sessions?.length > 0 && this.renderHeaders()}

          {sessions.length > 0 &&
            this.renderTimings('Monday', 'mon_start_time', 'mon_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Tuesday', 'tue_start_time', 'tue_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Wednesday', 'wed_start_time', 'wed_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Thursday', 'thu_start_time', 'thu_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Friday', 'fri_start_time', 'fri_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Saturday', 'sat_start_time', 'sat_end_time')}

          {sessions.length > 0 &&
            this.renderTimings('Sunday', 'sun_start_time', 'sun_end_time')}
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(DoctorTimings);
