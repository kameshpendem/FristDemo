import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './RequestsStyles';
import {nameConversion, practiceTimings} from '../../../../utils/NameConversion';

class HospitalBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {item, t} = this.props;
    return (
      <View>
        <View style={styles.hospitalBodyPaddingBottom}>
          <Text style={styles.heading}>
            {t('MY_PRACTICES.REQUESTS.BRANCH_AND_WORK_LOCATION')}
          </Text>
          <Text style={styles.subHeading}>
            {nameConversion(item.branch_name)}, {nameConversion(item.CITY)}
          </Text>
        </View>
        <View style={styles.hospitalBodyPaddingBottom}>
          <Text style={styles.heading}>
            {t('MY_PRACTICES.REQUESTS.SPECIALIZATION')}
          </Text>
          <Text style={styles.subHeading}>{item.specialization}</Text>
        </View>
        <View style={styles.hospitalBodyPaddingBottom}>
          <Text style={styles.heading}>
            {t('MY_PRACTICES.REQUESTS.WORKING_DAYS_AND_TIMINGS')}
          </Text>
          <Text style={styles.subHeading}>{practiceTimings(item)}</Text>
        </View>
        <View style={styles.hospitalBodyPaddingBottom}>
          <Text style={styles.heading}>
            {t('MY_PRACTICES.REQUESTS.APPOINTMENT_SLOT_TIME')}
          </Text>
          <Text style={styles.subHeading}>
            {item.slot_timing} {t('MY_PRACTICES.REQUESTS.EACH_APPOINTMENT')}
          </Text>
        </View>
      </View>
    );
  }
}

export default withTranslation()(HospitalBody);
