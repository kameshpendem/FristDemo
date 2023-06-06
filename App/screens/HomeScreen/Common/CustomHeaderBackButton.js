import React from 'react';
import {TouchableOpacity} from 'react-native';
import ArrowLeftWhiteIcon from '../../../assets/images/arrow_left_white.svg';

const CustomHeaderBackButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.headerBackTouchable, style ? style : {}]}>
      <ArrowLeftWhiteIcon style={styles.headerBackIcon} />
    </TouchableOpacity>
  );
};

const styles = {
  headerBackTouchable: {
    padding: 10,
    paddingLeft: 5,
  },
  headerBackIcon: {
    width: 35,
    height: 35,
  },
};

export default CustomHeaderBackButton;
