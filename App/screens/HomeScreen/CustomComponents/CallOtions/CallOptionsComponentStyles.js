import {StyleSheet} from 'react-native';
import {LIST_SUB_TEXT_COLOR} from '../../../../themes/variable';

export default StyleSheet.create({
  callButtonStyles: {
    height: 20,
    backgroundColor: 'transparent',
    elevation: 0,
    paddingLeft: 10,
  },
  numberStyles: {
    marginLeft: 5,
    color: LIST_SUB_TEXT_COLOR,
    fontWeight: '800',
    fontSize: 12,
  },
});
