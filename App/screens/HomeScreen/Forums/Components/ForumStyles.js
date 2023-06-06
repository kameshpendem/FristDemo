import {StyleSheet} from 'react-native';
import {theme} from '../../../../themes/Theme';
import {wp} from '../../../../themes/Scale';
import {
  APP_PRIMARY_COLOR,
  PATIENT_CARD_BORDER_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  card: {
    borderRadius: 8,
    elevation: 0,
  },
  cardItem: {
    flexDirection: 'column',
    borderRadius: wp(8),
    borderWidth: 1,
    elevation: 0,
    borderColor: PATIENT_CARD_BORDER_COLOR,
  },
  viewPadding: {
    padding: 5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  questionView: {
    width: '100%',
  },
  questionText: {
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.sm,
    color: '#1D1D24',
  },
  postedView: {
    alignSelf: 'flex-start',
  },
  postedText: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
    color: '#1D1D24',
  },
  postedRepliedByText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm,
  },
  postedRepliedOnText: {
    color: '#646467',
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  replyView: {
    width: '100%',
  },
  replyText: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
    color: '#1D1D24',
  },
  repliedView: {
    flexDirection: 'row',
  },
  repliedDetailsView: {
    flex: 3,
    flexDirection: 'row',
  },
  repliedDetailsIconView: {
    marginRight: 5,
  },
  totalRepliesView: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  totalRepliesText: {
    fontSize: theme.fontSizes.sm,
    color: APP_PRIMARY_COLOR,
    paddingLeft: 5,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  paddingTop0: {
    paddingTop: 0,
  },
});
