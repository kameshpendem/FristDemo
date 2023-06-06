import {StyleSheet} from 'react-native';
import {wp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';
import {
  APP_PRIMARY_COLOR,
  APP_PRIMARY_LIGHT_BACKGROUND_COLOR,
  DEFAULT_GREY_BACKGROUND_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  PATIENT_CARD_BORDER_COLOR,
  PICKER_TEXT_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  card: {
    borderRadius: wp(8),
    elevation: 0,
  },
  childReplyCard: {
    width: '100%',
  },
  cardItem: {
    flexDirection: 'column',
    borderRadius: wp(8),
    elevation: 0,
    borderWidth: 1,
    borderColor: PATIENT_CARD_BORDER_COLOR,
  },
  expandCollapseCardItem: {
    borderTopWidth: 1,
    borderTopColor: DEFAULT_LIGHT_GREY_COLOR,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  childReplyCardItem: {
    backgroundColor: DEFAULT_GREY_BACKGROUND_COLOR,
  },
  viewPadding: {
    // padding: 5,
    paddingLeft: 0,
    paddingRight: 0,
    alignSelf: 'flex-start',
  },
  replyText: {
    fontSize: theme.fontSizes.md1,
    fontFamily: theme.fontFamily.primaryRegular,
    color: PICKER_TEXT_COLOR,
  },
  postedView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  postedText: {
    flexDirection: 'column',
    paddingLeft: wp(5),
  },
  postedByText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm,
  },
  postedOnText: {
    color: DEFAULT_GREY_COLOR,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  actionsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachActionView: {
    flex: 3,
  },
  replyTouchableOpacity: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionText: {
    paddingLeft: wp(5),
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fontFamily.primarySemiBold,
    color: APP_PRIMARY_COLOR,
  },
  expandCollapseTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
    flex: 1,
  },
  expandCollapseText: {
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  expandCollapseView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  expandedTouchable: {
    backgroundColor: APP_PRIMARY_LIGHT_BACKGROUND_COLOR,
    marginBottom: 8,
  },
  replyCard: {
    flexDirection: 'column',
    borderRadius: wp(8),
    elevation: 0,
    borderWidth: 1,
    borderColor: PATIENT_CARD_BORDER_COLOR,
  },
  replyView: {
    paddingTop: wp(8),
    paddingBottom: wp(8),
  },
});
