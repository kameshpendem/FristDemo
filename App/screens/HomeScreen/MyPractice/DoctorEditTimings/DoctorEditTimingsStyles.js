import {StyleSheet} from 'react-native';
import {wp, hp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  CARD_SUB_TEXT_COLOR,
  APP_PRIMARY_COLOR,
  PATIENT_CARD_BUTTON_SECTION_COLOR,
  LIST_SUB_TEXT_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../../themes/variable';

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
  shadowRadius: 2,
  elevation: 5,
  borderColor: DEFAULT_GREY_COLOR,
};

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  screenPadding: {
    padding: wp(15),
  },
  sessionTimings: {
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  sessionTimeText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  itemsEnd: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  // amSectionView: {
  //   flexDirection: 'row',
  //   width: wp(82),
  //   height: hp(30),
  //   borderRadius: wp(18),
  //   backgroundColor: '#E8E8E8',
  // },
  amView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: wp(18),
  },
  amText: {
    color: DEFAULT_WHITE_COLOR,
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.sm,
  },
  // pmView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#E8E8E8',
  //   borderRadius: wp(18),
  // },
  pmText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
  },
  startTimeMainSection: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(15),
    paddingBottom: wp(15),
  },
  textAndToggleMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  startTimeText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.ml,
  },
  endtextAndToggleMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 50,
  },
  marginBottom15: {
    marginBottom: wp(15),
  },
  disableTime: {
    color: theme.colors.time.primary,
    fontSize: theme.fontSizes.ml1,
    fontFamily: theme.fontFamily.primaryBold,
  },
  disableTimeAmText: {
    color: theme.colors.time.primary,
    fontSize: theme.fontSizes.md1,
    fontFamily: theme.fontFamily.primaryBold,
  },
  timeTouchableView: {
    paddingTop: wp(18),
    paddingBottom: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingLeft: wp(20),
    paddingRight: wp(20),
    marginTop: wp(10),
  },
  horizontalLine: {
    borderBottomWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  endTimeMainView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(15),
    // paddingBottom: wp(15),
  },
  activeTime: {
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.ml1,
    fontFamily: theme.fontFamily.primaryBold,
  },
  activeTimeAmText: {
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.md1,
    fontFamily: theme.fontFamily.primaryBold,
  },
  footerMargin: {},
  footerStyles: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    elevation: 0,
  },
  saveButtonStyles: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
    backgroundColor: APP_PRIMARY_COLOR,
    elevation: 0,
  },
  saveTextStyles: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  activeTimeTouchableView: {
    paddingTop: wp(18),
    paddingBottom: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: PATIENT_CARD_BUTTON_SECTION_COLOR,
    textAlign: 'center',
    flex: 1,
    borderRadius: wp(20),
    marginTop: wp(10),
  },
  appointmentSessionView: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginTop: wp(10),
  },
  appointmentSessionHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.md,
  },
  switchView: {
    marginTop: wp(8),
    marginBottom: wp(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  switchText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  checkBox: {
    borderRadius: wp(5),
    paddingLeft: 0,
    height: hp(20),
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: wp(-10),
  },
  checkBoxAndTextView: {
    flexDirection: 'row',
    paddingTop: wp(15),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  checkBoxAndText: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  checkBoxText: {
    paddingLeft: wp(20),
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  allDaysText: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
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
  width70: {
    width: '70%',
  },
  hospitalAreaName: {
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
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
  modalHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  timeHeaderText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  timeText: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.ml,
  },
  modalTimeView: {
    width: '40%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  filledArrowView: {
    width: '20%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalTimeSlotView: {
    marginTop: wp(10),
    backgroundColor: theme.colors.time.secondary,
    borderRadius: wp(10),
    padding: wp(10),
    width: '62%',
    flexShrink: 1,
    flexDirection: 'row',
  },
  daysCheckBoxView: {
    marginTop: wp(10),
    marginBottom: wp(20),
  },
  buttonView: {
    marginTop: wp(10),
    marginBottom: wp(10),
  },
  buttonStyles: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
    backgroundColor: APP_PRIMARY_COLOR,
    elevation: 0,
  },
  width95: {
    width: '95%',
  },
  appointmentTextInput: {
    borderWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    height: hp(45),
    borderRadius: wp(6),
    padding: wp(8),
  },
  clockIcon: { fontSize: 22, alignSelf: "center" },
  timing: {
    width: "auto",
    height: "auto",
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
    margin: 2,
    flexDirection: "row",
    fontSize: 16
    // alignSelf: "center"
  },
    timing: {
    width: "auto",
    height: "auto",
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
    margin: 2,
    flexDirection: "row",
    fontSize: 16
    // alignSelf: "center"
  },
  time: {
    marginLeft: 5,
    flexDirection: "row",
    flexWrap: "wrap"
    //alignSelf: "center"
  },
  time1: {
    // marginLeft: 50,
    flexDirection: "row",
    flexWrap: "wrap"
    //alignSelf: "center"
  },
  time2: {
    marginLeft: 55,
    flexDirection: "row",
    flexWrap: "wrap"
    //alignSelf: "center"
  },
});
