import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './PatientsStyles';

// components
import CallOptionsComponent from '../CustomComponents/CallOtions/CallOptionsComponent';

class PatientSearchCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePatientSearchCardDetails = () => {
    const {getPatientsDetails} = this.props;
    if (typeof getPatientsDetails === 'function') {
      getPatientsDetails();
    }
    return;
  };

  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.handlePatientSearchCardDetails()}
        style={styles.autoSearchTouchableView}>
        <View style={[styles.flex, styles.autoSearchViewPadding]}>
          <Text style={styles.headerText}>
            <Text style={styles.subText}>
              {item.first_name.charAt(0).toUpperCase() +
                item.first_name.slice(1)}{' '}
              {item.middle_name != null
                ? item.middle_name.charAt(0).toUpperCase() +
                  item.middle_name.slice(1)
                : ''}{' '}
              {item.last_name.charAt(0).toUpperCase() + item.last_name.slice(1)}
            </Text>
          </Text>
          <View style={[styles.flex, styles.flexDirection]}>
            <View>
              <Text style={styles.headerText}>
                <Text style={styles.id}
                testID={item.hlpid+"text"}
                accessibilityLabel={item.hlpid+"text"}>{item.hlpid}</Text>
              </Text>
            </View>
            <View style={styles.itemsEnd}>
              <CallOptionsComponent phoneNumber={item.phone_no} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTranslation()(PatientSearchCard);
