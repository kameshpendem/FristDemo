import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './RequestsStyles';
import {nameConversion} from '../../../../utils/NameConversion';

class HospitalFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderActions = () => {
    const {action} = this.props;
    if (typeof action === 'function') {
      action();
    }
    return;
  };
  render() {
    const {item, t} = this.props;
    return (
      <View style={styles.moreTextStyles}>
        <Text style={styles.moreInfoContactText}>
          {t('MY_PRACTICES.REQUESTS.FOOTER_SECTION_TEXT')}{' '}
          <Text
            onPress={() => this.renderActions()}
            style={styles.hospitalNameText}>
            {nameConversion(item.branch_name)}
          </Text>
        </Text>
      </View>
    );
  }
}

export default withTranslation()(HospitalFooter);
