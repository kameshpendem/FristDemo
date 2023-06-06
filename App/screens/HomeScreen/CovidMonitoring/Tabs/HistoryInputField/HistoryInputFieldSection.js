import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {withTranslation} from 'react-i18next';

// styles
import styles from './HistoryInputFieldStyle';
import ActivityImage from '../../../../../assets/images/activity_black.png';

class HistoryInputFieldSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {activityValue} = this.props;
    return (
      <View style={[styles.temperatureInputFiledWrapper]}>
        <View style={styles.inputSectionHeightAndWidth}>
          <View style={[styles.inputFiledSection, styles.itemsCenter, styles.flex]}>
            {activityValue ? (
              <View
                style={[
                  styles.activity,
                  styles.paddingBottom10,
                  styles.itemsCenter,
                ]}>
                {this.props.value !== '' && (
                  <Text style={[styles.font12, {color: `${this.props.color}`}]}
                  testID={this.props.value+"text"}
                  accessibilityLabel={this.props.value+"text"}>
                    {this.props.value}
                  </Text>
                )}
                <View style={[styles.rowAlignment, styles.itemsCenter]}>
                  <Text
                    style={[
                      styles.font12,
                      styles.marginTop,
                      {color: `${this.props.activityColor}`},
                    ]}
                    testID={activityValue+"text"}
                    accessibilityLabel={activityValue+"text"}>
                    {activityValue}
                  </Text>
                  <Image
                  testID="activityImage"
                  accessibilityLabel="activityImage"
                    source={ActivityImage}
                    style={styles.imageStyles}></Image>
                </View>
              </View>
            ) : (
              <View style={[styles.itemsCenter, styles.flex]}>
                <Text style={[styles.input, {color: `${this.props.color}`}]}
                testID={this.props.value+"text"}
                accessibilityLabel={this.props.value+"text"}>
                {this.props.value}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default withTranslation()(HistoryInputFieldSection);
