import {StyleSheet} from 'react-native';

import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  CARD_SUB_TEXT_COLOR,
  LIST_SUB_TEXT_COLOR,
} from '../../../../themes/variable';
import {wp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  screenPadding: {
    padding: wp(15),
  },
  viewBottomBorder: {
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  backgroundColor: {
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  headingText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  timeText: {
    fontSize: theme.fontSizes.xxs,
  },
  timingViewPaddings: {
    padding: wp(15),
    paddingTop: wp(10),
    paddingBottom: wp(10),
  },
  viewBorder: {
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderWidth: 1,
  },
  timingsViewMargin: {
    marginTop: wp(5),
  },
  dayAndTimeTextStyles: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  visitTypeText: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.xxs,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  itemsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  width20: {
    width: '22%',
  },
});
