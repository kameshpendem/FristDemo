import {StyleSheet} from 'react-native';
import { hp } from '../../../themes/Scale';
import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  FONT_FAMILY,
  CARD_SUB_TEXT_COLOR,
} from '../../../themes/variable';
export default StyleSheet.create({
  tabStyle: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    elevation: 0,
  },
  textStyle: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
  },
  activeTabStyles: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    elevation: 0,
  },
  activeTextStyles: {
    color: APP_PRIMARY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
  },
  indicatorStyles: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: hp(2.5)
  },
});
