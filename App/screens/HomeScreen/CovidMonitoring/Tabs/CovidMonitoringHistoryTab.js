import React, {Component} from 'react';
import {View, ActivityIndicator, Text, ScrollView} from 'react-native';
import {Toast} from 'native-base';
import {withTranslation} from 'react-i18next';
// import {ScrollView} from 'react-native-gesture-handler';
import {Table, Row} from 'react-native-table-component';
import AsyncStorage from '@react-native-community/async-storage';


// components
import HistoryInputFieldSection from '../Tabs/HistoryInputField/HistoryInputFieldSection';
import HistoryCheckBoxSection from '../Tabs/HistoryCheck/HistoryCheckBoxSection';

// styles and constants
import historyStyles from './CovidMonitoringHistoryTabStyles';

//Utils:
import {dateFormat} from '../Utils/DateTimeUtil';
import {
  updateTemperatureColorCodes,
  updatePulseRateColor,
  updatedActivitySpo2Color,
  updatedSpo2Color,
  updatedSystolicBloodPressureColor,
  updatedSystolicRateColor,
} from '../Utils/OverallStatus';
// api Service
import API from '../../../../services/Api';
import {APP_PRIMARY_COLOR, COLOR_CODES} from '../../../../themes/variable';

class CovidMonitoringHistoryTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tableTitle: [],
      checkBoxKeys: [
        'cough',
        'running_nose',
        'sore_throat',
        'body_pain',
        'loss_appetite',
        'diarrhea',
        'lost_sense',
        'diff_breath',
        'presure_chest',
        'bluish_lips',
        'confusion',
      ],
      covidCheckBoxesKeys: [
        'rtpcr',
        'antigen',
        'antibody',
        'hrct',
        'overall_status',
      ],
      init: true,
      refreshing: false,
      leftRef: React.createRef(null),
      rightRef: React.createRef(null),
      recordData: [],
      widthArray: [],
      tableHead: [],
      tableData: [],
    };
  }

  renderTableHeaders(t) {
    const tableTitle = [
      [t('HISTORY.TEMPERATURE')],
      [t('HISTORY.PULSE_RATE')],
      [t('HISTORY.SPO2')],
      [t('HISTORY.SYSTOLIC_BLOOD_PRESSURE')],
      [t('HISTORY.RESPIRATORY_RATE')],
      [t('HISTORY.SYMPTOMS')],
      [t('HISTORY.COUGH')],
      [t('HISTORY.RUNNING_NOSE')],
      [t('HISTORY.SORE_THROAT')],
      [t('HISTORY.BODY_PAIN')],
      [t('HISTORY.LOSS_OF_APPETITE')],
      [t('HISTORY.DIARRHEA')],
      [t('HISTORY.LOST_SENSE_OF_SMELL_AND_TASTE')],
      [t('HISTORY.DIFFICULTY_IN_BREATHING')],
      [t('HISTORY.PERSISTENT_PAIN_PRESSURE_IN_CHEST')],
      [t('HISTORY.BLUISH_LIPS_AND_FACE')],
      [t('HISTORY.CONFUSION_FATIGUE')],
      [t('HISTORY.COVID_TEST')],
      [t('HISTORY.RTPCR')],
      [t('HISTORY.RAPID_ANTIGEN')],
      [t('HISTORY.ANTIBODY_IGG')],
      [t('RECORD_VITAL.HRCT')],
      [t('HISTORY.OVERALL_STATUS')],
    ];
    return tableTitle;
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

  updateLoader() {
    this.setState({
      isLoading: true,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.init().then(() => {
      this.setState({refreshing: false});
    });
  };

  init = async () => {
    const {t} = this.props;
    const headers = await this.renderTableHeaders(t);

    const payload = {
      id: this.props.doctor_id,
      token: this.props.token,
      hlp_id: this.props.patient.hlpid,
      enc_id: this.props.patient.enc_id,
      doctor_flag: '1',
      role: await AsyncStorage.getItem('role'),
    };
    try {
      const response = await API.call(
        'post',
        'get_covid_vitals_record/',
        payload,
      );
      if (
        response &&
        response?.data &&
        response?.data?.vitals_list &&
        response?.data?.vitals_list?.length > 0
      ) {
        let historyList = response?.data?.vitals_list;

        // date headers start
        let dateHeaders = [];
        let table_data = [];
        historyList.map((elem) => {
          const formatDate = dateFormat(elem.date);
          dateHeaders.push(formatDate);
        });

        // Temperature section
        const temperatureInput = [];
        historyList.map((item) => {
          const tempInput = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={item.fever}
                color={updateTemperatureColorCodes(item.fever)}
              />
            </View>
          );
          temperatureInput.push(tempInput);
        });
        table_data.push(temperatureInput);

        // pulse rate section
        const pulseRateInput = [];
        historyList.map((item) => {
          const pulseInput = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={item.pulse_rate}
                activityValue={item.activity_pulse_rate}
                activityColor={updatePulseRateColor(item.activity_pulse_rate)}
                color={updatePulseRateColor(item.pulse_rate)}
              />
            </View>
          );
          pulseRateInput.push(pulseInput);
        });
        table_data.push(pulseRateInput);

        // Spo2 Section
        const spo2Input = [];
        historyList.map((item) => {
          const input = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={item.sp02}
                activityValue={item.activity_spo2}
                activityColor={updatedActivitySpo2Color(item.activity_spo2)}
                color={updatedSpo2Color(item.sp02)}
              />
            </View>
          );
          spo2Input.push(input);
        });
        table_data.push(spo2Input);

        // Systolic Blood pressure
        const systolicBloodPressure = [];
        historyList.map((item) => {
          const input = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={item.sbp}
                color={updatedSystolicBloodPressureColor(item.sbp)}
              />
            </View>
          );
          systolicBloodPressure.push(input);
        });
        table_data.push(systolicBloodPressure);

        // respiratory rate
        const respiratoryRate = [];
        historyList.map((item) => {
          const input = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={item.rrv}
                color={updatedSystolicRateColor(item.rrv)}
              />
            </View>
          );
          respiratoryRate.push(input);
        });
        table_data.push(respiratoryRate);

        // systolic rate
        const res = [];
        historyList.map((item) => {
          const input = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection
                value={''}
                color={updatedSystolicRateColor(item.rrv)}
              />
            </View>
          );
          res.push(input);
        });

        table_data.push(res);

        // checkBoxSections
        this.state.checkBoxKeys.forEach((element) => {
          let mapArray = [];
          historyList.forEach((ele) => {
            const checkBox = (
              <View style={historyStyles.inputMain}>
                <HistoryCheckBoxSection
                  color={
                    ele[element] === COLOR_CODES.NO ||
                    ele[element] === COLOR_CODES.MILD ||
                    ele[element] === COLOR_CODES.RGBA_GREEN
                      ? COLOR_CODES.NO
                      : ele[element] === COLOR_CODES.MODERATE_YELLOW ||
                        ele[element] === COLOR_CODES.SEVERE_YELLOW ||
                        ele[element] === COLOR_CODES.RGBA_YELLOW
                      ? COLOR_CODES.ORANGE
                      : ele[element] === COLOR_CODES.SEVERE ||
                        ele[element] === COLOR_CODES.SEVERE_RED ||
                        ele[element] === COLOR_CODES.SEVERE_RED_2 ||
                        ele[element] === COLOR_CODES.RGBA_RED
                      ? COLOR_CODES.SEVERE
                      : ''
                  }
                />
              </View>
            );
            mapArray.push(checkBox);
          });
          table_data.push(mapArray);
        });

        const covidTest = [];
        historyList.map((item) => {
          const input = (
            <View style={historyStyles.inputMain}>
              <HistoryInputFieldSection value={''} color={'transparent'} />
            </View>
          );
          covidTest.push(input);
        });
        table_data.push(covidTest);

        this.state.covidCheckBoxesKeys.forEach((element) => {
          let mapArray = [];
          historyList.forEach((ele) => {
            const checkBox = (
              <View style={historyStyles.inputMain}>
                <HistoryCheckBoxSection
                  color={
                    ele[element] === COLOR_CODES.NO ||
                    ele[element] === COLOR_CODES.MILD ||
                    ele[element] === COLOR_CODES.RGBA_GREEN
                      ? COLOR_CODES.NO
                      : ele[element] === COLOR_CODES.SEVERE ||
                        ele[element] === COLOR_CODES.SEVERE_RED ||
                        ele[element] === COLOR_CODES.SEVERE_RED_2 ||
                        ele[element] === COLOR_CODES.RGBA_RED
                      ? COLOR_CODES.SEVERE
                      : ele[element] === COLOR_CODES.MODERATE_YELLOW ||
                        ele[element] === COLOR_CODES.SEVERE_YELLOW ||
                        ele[element] === COLOR_CODES.RGBA_YELLOW
                      ? COLOR_CODES.ORANGE
                      : ele[element] === COLOR_CODES.NOT_TESTED
                      ? COLOR_CODES.NOT_TESTED
                      : ''
                  }
                />
              </View>
            );
            mapArray.push(checkBox);
          });
          table_data.push(mapArray);
        });

        let wArray = [];

        dateHeaders.forEach((ele, index) => {
          wArray.push(60);
        });

        this.setState({
          recordData: headers,
          widthArray: wArray,
          tableHead: dateHeaders,
          tableData: table_data,
        });
      }
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('HISTORY.HISTORY_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const {t} = this.props;
    const state = this.state;

    if (state.isLoading) {
      return (
        <View style={historyStyles.loader}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View style={historyStyles.tableWrapper}>
        {/* Left Column */}
        <View style={historyStyles.width120}>
          {/* Blank Cell */}
          <View style={historyStyles.dateCellView}>
            <Text style={historyStyles.tableDateText}
            testID="dateText"
            accessibilityLabel="dateText">{t('HISTORY.DATE')}</Text>
          </View>
          {/* Left Container : scroll synced */}
          <ScrollView
            ref={this.state.leftRef}
            style={historyStyles.leftScrollViewStyle}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}>
            <Table>
              {state.recordData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={[120]}
                  style={[
                    historyStyles.leftTableRowStyles,
                    index === 0 && historyStyles.tableZeroIndexStyles,
                    historyStyles.rowHeight,
                    index % 2
                      ? historyStyles.evenIndexBackgroundColor
                      : historyStyles.oddIndexBackgroundColor,
                  ]}
                  textStyle={historyStyles.leftTableTextStyles}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
        {/* Right Column */}
        <View style={historyStyles.rightTableView}>
          <ScrollView horizontal={true} bounces={false}>
            <View>
              <Table borderStyle={historyStyles.rightTableBorderStyles}>
                <Row
                  data={state.tableHead}
                  widthArr={state.widthArray}
                  style={historyStyles.rightTableHead}
                  textStyle={historyStyles.rightTableText}
                />
              </Table>
              <ScrollView
                ref={this.state.rightRef}
                style={historyStyles.dateWrapper}
                scrollEventThrottle={16}
                bounces={false}
                onScroll={(e) => {
                  const {y} = e.nativeEvent.contentOffset;
                  state.leftRef.current?.scrollTo({y, animated: false});
                }}>
                <Table>
                  {state.tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArray}
                      style={[
                        historyStyles.rightTableRowStyles,
                        index === 0 && historyStyles.tableZeroIndexStyles,
                        historyStyles.rowHeight,
                        index % 2
                          ? historyStyles.evenIndexBackgroundColor
                          : historyStyles.oddIndexBackgroundColor,
                      ]}
                      textStyle={historyStyles.textAlign}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default withTranslation()(CovidMonitoringHistoryTab);
