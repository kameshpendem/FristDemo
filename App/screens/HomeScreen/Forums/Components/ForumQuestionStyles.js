import {StyleSheet} from 'react-native';
import {theme} from '../../../../themes/Theme';
import {hp, wp} from '../../../../themes/Scale';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  PATIENT_CARD_BORDER_COLOR,
  PICKER_TEXT_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  card: {
    borderRadius: wp(8),
    elevation: 0,
  },
  cardItem: {
    flexDirection: 'column',
    borderRadius: wp(8),
    elevation: 0,
    borderWidth: 1,
    borderColor: PATIENT_CARD_BORDER_COLOR,
  },
  viewPadding: {
    // padding: 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  questionView: {
    width: '100%',
  },
  questionText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryBold,
    color: PICKER_TEXT_COLOR,
  },
  postedView: {
    alignSelf: 'flex-start',
  },
  postedText: {
    fontSize: theme.fontSizes.sm,
    color: PICKER_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  postedByText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm,
  },
  postedOnText: {
    color: DEFAULT_GREY_COLOR,
  },
  paddingTop0: {
    paddingTop: 0,
  },
});
