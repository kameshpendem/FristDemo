import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';

class AppLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {size, color} = this.props;
    return (
      <View style={styles.loaderView}>
        <ActivityIndicator
          size={size || 'large'}
          color={color || APP_PRIMARY_COLOR}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoader;
