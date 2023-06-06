import {StyleSheet} from 'react-native';
import {wp} from '../../../themes/Scale';
import {
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../themes/variable';
import {theme} from '../../../themes/Theme';

export const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
  },
  modalView: {
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: wp(18),
    borderTopRightRadius: wp(18),
    padding: wp(10),
    shadowColor: DEFAULT_WHITE_COLOR,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: wp(2),
    elevation: wp(5),
    borderColor: DEFAULT_GREY_COLOR,
  },
  modalStyles: {
    margin: 0,
    padding: 0,
  },
  countryInfoLabel: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fontFamily.primaryBold,
    color: DEFAULT_BLACK_COLOR,
  },
  countryNameLabel: {
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primaryRegular,
    color: DEFAULT_BLACK_COLOR,
  },
  selectedItem: {
    backgroundColor: '#e6f3fb',
  },
  closeIconImg: {
    color: DEFAULT_BLACK_COLOR,
  },
});
