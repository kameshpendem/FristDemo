import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../../../themes/variable';
import React from 'react';

const Loader = (props) => {
  return (
    <View
      style={[
        styles.loaderView,
        {
          backgroundColor: props.noBackground ? '' : DEFAULT_BACKGROUND_COLOR,
        },
      ]}>
      <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
