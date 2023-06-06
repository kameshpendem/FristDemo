import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Table, Row} from 'react-native-table-component';
import AsyncStorage from '@react-native-community/async-storage';
import {Toast} from 'native-base';
import i18n from 'i18next';

// styles
import styles from './LeaveOrAbsenceHistoryStyles';

// services
import {doctorAbsentAndLeaves} from '../../../services/MyPracticeService';
import {dateDDMMYYYY} from '../CovidMonitoring/Utils/DateTimeUtil';
import AppLoader from '../Common/AppLoader';

class LeaveOrAbsenceHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [
        i18n.t('ABSENCE_LEAVE_HISTORY.APPLIED_ON'),
        i18n.t('ABSENCE_LEAVE_HISTORY.FROM_DATE'),
        i18n.t('ABSENCE_LEAVE_HISTORY.TILL_DATE'),
        i18n.t('ABSENCE_LEAVE_HISTORY.TIMINGS'),
        i18n.t('ABSENCE_LEAVE_HISTORY.LEAVE_TYPE'),
      ],
      tableData: [],
      loader: true,
      refreshing: false,
      //   Array of widths to get headers and row body  should equal space
      widthArr: [120, 120, 120, 120, 150],
      init: true,
    };
  }

  init = async () => {
    const {t} = this.props;
    try {
      const doctor_id = await AsyncStorage.getItem('doctorid');

      const response = await doctorAbsentAndLeaves(doctor_id);

      if (response?.data?.appointment_history) {
        const leavesData = response.data.appointment_history;
        const leaves = [];
        leavesData.forEach((element) => {
          leaves.push([
            dateDDMMYYYY(element.date_added),
            element.from_date,
            element.to_date,
            element.from_time + '-' + element.to_time,
            element.leave_type,
          ]);
        });
        this.setState({
          tableData: leaves,
          loader: false,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('ABSENCE_LEAVE_HISTORY.ERROR') || (error && error.message),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.init().then(() => {
      this.setState({refreshing: false});
    });
  };

  componentDidMount() {
    this.init();
    this.props.navigation.addListener('willFocus', this._handleStateChange);
  }

  componentWillUnmount() {
    // this.props.onRef(null);
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
  };

  render() {
    const state = this.state;
    const {t} = this.props;

    if (state.tableData.length > 0) {
      return (
        <View style={styles.wrapper}>
          <ScrollView
            horizontal={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <View>
              {/* Leave and absence table header and fixed while scrolling to screen up, headers move while scrolling horizontal */}
              <Table>
                <Row
                  data={state.tableHead}
                  widthArr={state.widthArr}
                  style={styles.headerRowHeight}
                  textStyle={styles.tableHeaders}
                />
              </Table>
              <ScrollView>
                {/* Leave and absence table body and showing different color to odd row */}
                <Table>
                  {state.tableData.length > 0 &&
                    state.tableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={state.widthArr}
                        style={[styles.tableRow, index % 2 && styles.oddRow]}
                        textStyle={styles.tableText}
                      />
                    ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      );
    }

    if (this.state.loader) {
      return <AppLoader size={'large'} />;
    } else {
      return (
        <Text style={styles.leavesInfoText}
        testID="historyNotAvailableText"
        accessibilityLabel="historyNotAvailableText">
          {t('ABSENCE_LEAVE_HISTORY.NOT_AVAILABLE')}
        </Text>
      );
    }
  }
}

export default withTranslation()(LeaveOrAbsenceHistory);
