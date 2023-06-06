import {StyleSheet} from 'react-native';
import {wp, hp} from '../../../themes/Scale';
import {theme} from '../../../themes/Theme';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  CARD_SUB_TEXT_COLOR,
  LIST_SUB_TEXT_COLOR,
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_RED_COLOR,
} from '../../../themes/variable';

const textInputStyles = {
  borderWidth: wp(1),
  borderColor: DEFAULT_LIGHT_GREY_COLOR,
  marginTop: wp(10),
  borderRadius: wp(6),
  marginBottom: wp(15),
};

const modalStyles = {
  marginTop: 'auto',
  backgroundColor: DEFAULT_WHITE_COLOR,
  borderTopLeftRadius: wp(15),
  borderTopRightRadius: wp(15),
  padding: wp(20),
  paddingLeft: wp(15),
  paddingRight: wp(15),
  shadowColor: DEFAULT_WHITE_COLOR,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.8,
  shadowRadius: wp(2),
  elevation: wp(5),
  borderColor: DEFAULT_GREY_COLOR,
};

const buttonStyes = {
  flex: 1,
  borderRadius: wp(6),
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 0,
};

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  screenPadding: {
    paddingLeft: wp(15),
    paddingRight: wp(15),
  },
  selectPracticeAndBranchMainView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  selectPracticeMainView: {
    flex: 1,
    borderRightWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    padding: wp(12),
  },
  selectBranchMainView: {
    flex: 1,
    padding: wp(12),
  },
  practiceAndBranchStyles: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  filledArrowView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    opacity: 0.8,
  },
  width90: {
    width: '90%',
  },
  leaveTypeHeading: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm1,
  },
  itemsEnd: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  selectLeaveTypeView: {
    borderBottomWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginTop: wp(8),
    paddingBottom: wp(5),
    flexDirection: 'row',
  },
  leaveTypeText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  formSectionPadding: {
    padding: wp(12),
  },
  timeDateMainView: {
    marginTop: wp(15),
    flexDirection: 'row',
  },
  selectDateView: {
    borderBottomWidth: wp(1),
    marginTop: wp(10),
    // width: '80%',
    paddingBottom: wp(5),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  dateTex: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  marginRight15: {
    marginRight: wp(15),
  },
  marginLeft15: {
    marginLeft: wp(15),
  },
  reasonTextInput: {
    ...textInputStyles,
    height: hp(60),
  },
  contactDetailsTextInput: {
    ...textInputStyles,
    height: hp(100),
  },
  marginTop10: {
    marginTop: wp(10),
  },
  marginBottom8: {
    marginBottom: wp(8),
  },
  marginTop15: {
    marginTop: wp(15),
  },
  marginBottom10: {
    marginBottom: wp(10),
  },
  itemsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  footerBackgroundColor: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: wp(12),
    marginLeft: wp(12),
    elevation: 0,
  },
  elevation: {
    elevation: 0,
  },
  saveButton: {
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: wp(6),
  },
  cancelText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  saveText: {
    color: DEFAULT_WHITE_COLOR,
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.md,
  },

  dropDownArrowOpacity: {
    opacity: 0.8,
  },
  paddingBottom0: {
    paddingBottom: 0,
  },
  paddingTop0: {
    paddingTop: 0,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  closeModal: {
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
    paddingBottom: wp(5),
  },
  hospitalViewMargin: {
    marginBottom: wp(8),
  },
  width95: {
    width: '95%',
  },
  modalHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryBold,
  },
  closeView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
  touchableArea: {
    height: hp(20),
    width: wp(30),
  },
  closeImage: {
    height: hp(18),
    width: wp(18),
  },
  leaveTypesText: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  leaveTypeTouchableArea: {
    paddingTop: wp(8),
    paddingBottom: wp(8),
  },
  scheduleButton: {
    backgroundColor: APP_PRIMARY_COLOR,
    ...buttonStyes,
    marginRight: wp(5),
  },
  cancelButton: {
    backgroundColor: DEFAULT_RED_COLOR,
    ...buttonStyes,
    marginLeft: wp(5),
  },
  buttonsText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  previousHistoryText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  clickHereText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.md,
    textDecorationLine: 'underline',
    paddingTop: wp(5),
  },
  paddingBottom: {
    paddingBottom: wp(20),
  },
});
