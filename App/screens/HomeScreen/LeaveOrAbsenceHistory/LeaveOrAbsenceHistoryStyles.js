import {StyleSheet} from 'react-native';
import {
  DEFAULT_BACKGROUND_COLOR,
  CARD_SUB_TEXT_COLOR,
  INPUT_BORDER_COLOR,
} from '../../../themes/variable';
import {theme} from '../../../themes/Theme';
import {hp, wp} from '../../../themes/Scale';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  screenPadding: {
    padding: wp(10),
  },
  tableText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
    paddingLeft: wp(20),
    color: CARD_SUB_TEXT_COLOR,
  },
  tableHeaders: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryBold,
    paddingLeft: wp(20),
    color: CARD_SUB_TEXT_COLOR,
  },
  tableRow: {
    height: hp(50),
    backgroundColor: theme.colors.table.primary,
    borderBottomWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
  },
  headerRowHeight: {
    height: hp(50),
  },
  oddRow: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  leavesInfoText: {
    textAlign: 'center',
    marginTop: wp(10),
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primaryRegular,
  },
});
