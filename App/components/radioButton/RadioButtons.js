import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../themes/variable';

const RadioButtons = ({onPress, selected, children}) => {
  return (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.radioButtonText}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RadioButtons;

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButton: {
    height: 15,
    width: 15,
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
