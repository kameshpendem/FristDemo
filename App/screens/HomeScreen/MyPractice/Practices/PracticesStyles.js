import {StyleSheet} from 'react-native';

import {
  DEFAULT_BACKGROUND_COLOR,
  CARD_SUB_TEXT_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  LIST_SUB_TEXT_COLOR,
  DEFAULT_DANGER_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WARNING_COLOR,
  DEFAULT_BUTTON_BLACK_TEXT,
  APP_PRIMARY_COLOR,
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
  shadowOpacity: wp(0.8),
  shadowRadius: wp(2),
  elevation: wp(5),
  borderColor: DEFAULT_GREY_COLOR,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  approvedPractices: {
    padding: wp(20),
    paddingTop: wp(20),
    paddingLeft: wp(20),
    paddingBottom: wp(10),
  },
  approvedPracticeText: {
    fontFamily: theme.fontFamily.primaryRegular,
    color: CARD_SUB_TEXT_COLOR,
  },
  practicesCardMainView: {
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderWidth: wp(1),
    padding: wp(15),
    paddingBottom: wp(10),
    paddingTop: wp(10),
    flexDirection: 'row',
    marginBottom: wp(10),
  },
  imageView: {
    paddingRight: wp(10),
  },
  imageStyles: {
    height: wp(40),
    width: wp(40),
    borderRadius: 50,
  },
  hospitalName: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.md,
  },
  hospitalAreaName: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  menuSymbolMainView: {
    flex: 1,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  hospitalSectionMainView: {
    borderBottomWidth: 0.55,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    paddingBottom: wp(8),
    flexDirection: 'row',
    elevation: 0,
  },
  specializationAndTimingView: {
    paddingTop: wp(8),
    flexDirection: 'row',
  },
  specializationText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
    paddingBottom: wp(3),
  },
  specializationValuesText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm,
    paddingBottom: wp(3),
  },
  timingsText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.xs,
    paddingBottom: wp(3),
  },
  width35: {
    width: '35%',
  },
  width3: {
    width: '3%',
  },
  width85: {
    width: '85%',
  },
  textPaddingBottom: {
    paddingBottom: wp(10),
    color: DEFAULT_DANGER_COLOR,
  },
  modalPaddingStyles: {
    padding: wp(0),
    margin: wp(0),
  },
  closeModal: {
    height: '60%',
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
    paddingBottom: wp(5),
  },
  closeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignContent: 'center',
  },
  touchableArea: {
    height: hp(20),
    width: wp(30),
  },
  closeImage: {
    height: hp(18),
    width: wp(18),
  },
  width70: {
    width: '70%',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  actionHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.md,
  },
  actionHeaderSubText: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  disableOpacity: {
    opacity: 0.3,
  },
  actionsModalView: {
    paddingTop: wp(10),
    paddingBottom: wp(10),
  },
  actionImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: wp(12),
  },
  actionViewMarginBottom: {
    marginBottom: wp(20),
  },
  hospitalViewMargin: {
    marginBottom: wp(8),
  },
  closeImageStyles: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    alignContent: 'flex-start',
  },
  deActiveText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm1,
  },
  deActiveModal: {
    // height: '45%',
    ...modalStyles,
  },
  deActiveWaringSectionView: {
    backgroundColor: DEFAULT_WARNING_COLOR,
    borderRadius: wp(10),
    padding: wp(10),
  },
  deActiveWaringHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm1,
    paddingBottom: wp(12),
  },
  warningText: {
    fontFamily: theme.fontFamily.primaryRegular,
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.sm1,
    paddingLeft: wp(3),
    flex: 1,
  },
  itemsStart: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  warningIconAndTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    paddingBottom: wp(5),
  },
  deActiveButtonsView: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: wp(20),
    paddingRight: wp(0),
    paddingBottom: wp(10),
    flexDirection: 'row',
  },
  deActiveYesButton: {
    borderRadius: wp(6),
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: wp(10),
    marginRight: wp(10),
    elevation: 0,
  },
  yesButtonText: {
    color: DEFAULT_BUTTON_BLACK_TEXT,
    fontSize: theme.fontSizes.md,
  },
  deActiveNoButton: {
    borderRadius: wp(6),
    backgroundColor: APP_PRIMARY_COLOR,
    padding: wp(10),
    elevation: 0,
  },
  noButtonText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.md,
  },
  width90: {
    width: '90%',
  },
  confirmTextHeading: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.sm1,
    fontFamily: theme.fontFamily.primarySemiBold,
    paddingBottom: wp(8),
  },
  currentPasswordText: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.sm1,
    fontFamily: theme.fontFamily.primaryRegular,
    paddingBottom: wp(8),
  },
  passwordInput: {
    borderBottomWidth: wp(1),
    height: hp(45),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    fontSize: theme.fontSizes.sm,
    marginTop: wp(-15),
    paddingBottom: wp(0),
  },
  confirmButton: {
    borderRadius: wp(6),
    backgroundColor: APP_PRIMARY_COLOR,
    padding: wp(10),
    paddingLeft: wp(45),
    paddingRight: wp(45),
    elevation: 0,
  },
  activateButtonView: {
    borderRadius: 50,
    width: wp(150),
    backgroundColor: APP_PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  activateText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
});
