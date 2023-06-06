import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './RequestsStyles';

// images
import Patients from '../../../../assets/images/patients.png';
import {nameConversion} from '../../../../utils/NameConversion';

class HospitalDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {item} = this.props;
    return (
      <View style={styles.hospitalDetailsMainView}>
        <View style={styles.imageView}>
          <Image source={Patients} style={[styles.imageStyles]} />
        </View>
        <View style={styles.hospitalTextView}>
          <Text style={styles.hospitalName}>
            {nameConversion(item.branch_name)}
          </Text>
          <Text style={styles.hospitalType} numberOfLines={1}>
            {item.type}
          </Text>
        </View>
      </View>
    );
  }
}

export default withTranslation()(HospitalDetailsCard);
