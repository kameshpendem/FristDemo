import {StyleSheet} from 'react-native';

import {
  DEFAULT_BACKGROUND_COLOR,
  CARD_SUB_TEXT_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_DANGER_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../../themes/variable';

import {theme} from '../../../../themes/Theme';
import {wp, hp} from '../../../../themes/Scale';

const modalStyles = {
  marginTop: 'auto',
  backgroundColor: DEFAULT_WHITE_COLOR,
  borderTopLeftRadius: wp(15),
  borderTopRightRadius: wp(15),
  padding: wp(20),
  shadowColor: DEFAULT_WHITE_COLOR,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.8,
  shadowRadius: wp(2),
  elevation: wp(5),
  borderColor: DEFAULT_GREY_COLOR,
};

export default StyleSheet.create({
  requestWrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  screenPadding: {
    paddingLeft: wp(15),
    paddingRight: wp(15),
  },
  requestInfoView: {
    paddingTop: wp(18),
    paddingBottom: wp(15),
  },
  requestInfoText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  cardMainView: {
    borderWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginBottom: wp(10),
  },
  imageStyles: {
    height: hp(40),
    width: wp(40),
    borderRadius: 100,
  },
  hospitalDetailsMainView: {
    paddingTop: wp(10),
    paddingBottom: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  imageView: {
    borderRadius: 100,
    borderWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    padding: wp(2),
  },
  hospitalTextView: {
    paddingLeft: wp(10),
  },
  hospitalName: {
    fontFamily: theme.fontFamily.primarySemiBold,
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
  },
  hospitalType: {
    fontFamily: theme.fontFamily.primaryRegular,
    color: LIST_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.sm,
  },
  horizontalLine: {
    borderBottomWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginTop: wp(10),
    marginBottom: wp(10),
  },
  hospitalBodyPaddingBottom: {
    paddingBottom: wp(15),
  },
  heading: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: wp(16),
  },
  subHeading: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: wp(16),
  },
  moreInfoContactText: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: wp(16),
  },
  hospitalNameText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: wp(16),
  },
  moreTextStyles: {
    paddingBottom: wp(12),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  requestButtonsMainView: {
    flexDirection: 'row',
    marginBottom: wp(15),
    marginTop: wp(15),
  },
  acceptButtonStyles: {
    padding: wp(15),
    borderRadius: wp(18),
    height: hp(40),
    backgroundColor: theme.colors.button.primary,
    elevation: 0,
  },
  acceptText: {
    paddingLeft: wp(5),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.md,
  },
  declineButtonStyles: {
    padding: wp(15),
    borderRadius: wp(18),
    height: hp(40),
    backgroundColor: theme.colors.button.secondary,
    elevation: 0,
    marginLeft: wp(10),
  },
  declineText: {
    paddingLeft: wp(5),
    color: DEFAULT_DANGER_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  modalPaddingStyles: {
    padding: wp(0),
    margin: wp(0),
  },
  closeModal: {
    height: '70%',
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
    paddingBottom: wp(5),
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  hospitalViewMargin: {
    marginBottom: wp(8),
  },
  closeImage: {
    height: hp(15),
    width: wp(15),
  },
  width90: {
    width: '90%',
  },
  acceptModalHeaderText: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: wp(16),
    color: CARD_SUB_TEXT_COLOR,
  },
  modalBody: {
    padding: wp(15),
    backgroundColor: theme.colors.time.secondary,
    paddingTop: wp(10),
  },
  modalAcceptButton: {
    width: '100%',
    backgroundColor: theme.colors.button.primary,
    elevation: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
  },
  modalAcceptButtonView: {
    marginTop: wp(25),
  },
  closeView: {
    flex: 1,
    alignItems: 'flex-end',
    alignContent: 'center',
  },
  closeIcon: {
    marginLeft: wp(10),
  },
  declineReasonText: {
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
    color: LIST_SUB_TEXT_COLOR,
  },
  checkBoxActionsView: {
    marginTop: wp(10),
    marginBottom: wp(10),
  },
  checkBoxMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginTop: wp(3),
  },
  checkBoxMargin: {
    marginLeft: wp(-7),
  },
  checkBoxText: {
    marginLeft: wp(5),
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: wp(16),
    color: CARD_SUB_TEXT_COLOR,
  },
  modalDeclineButton: {
    width: '100%',
    backgroundColor: theme.colors.button.secondary,
    elevation: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
  },
  additionalTextInput: {
    marginTop: wp(12),
    borderWidth: wp(1),
    height: hp(100),
    width: '100%',
    borderColor: theme.colors.text.secondary,
    borderRadius: wp(6),
  },
});
