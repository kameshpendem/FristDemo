import {StyleSheet} from 'react-native';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_WHITE_COLOR,
  CARD_SUB_TEXT_COLOR,
  APP_PRIMARY_COLOR,
  LIST_SUB_TEXT_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../../themes/variable';
import {wp, lh, hp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';

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
  flex: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  footerStyles: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(7),
    paddingBottom: wp(7),
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  screenPadding: {
    paddingLeft: wp(15),
    paddingRight: wp(15),
  },
  termsText: {
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
    color: CARD_SUB_TEXT_COLOR,
  },
  linkText: {
    color: APP_PRIMARY_COLOR,
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primarySemiBold,
    lineHeight: lh(25),
    textDecorationLine: 'underline',
  },
  feesMainView: {
    paddingTop: wp(15),
    paddingBottom: wp(15),
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  consultationFeeText: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
  },
  inputMainView: {
    paddingTop: wp(15),
  },
  inputLabel: {
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
    color: LIST_SUB_TEXT_COLOR,
  },
  textAndInputSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  textInputStyles: {
    flex: 1,
    height: hp(45),
    padding: wp(5),
    paddingLeft: 0,
    fontSize: wp(16),
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  rsText: {
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
    color: CARD_SUB_TEXT_COLOR,
  },
  underLineStyles: {
    borderBottomWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  slotTimeMainView: {
    marginTop: wp(10),
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(15),
    paddingBottom: wp(15),
    borderBottomWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  labelPadding: {
    paddingTop: wp(10),
  },
  dropdownMainView: {
    flexDirection: 'row',
    paddingTop: wp(10),
    paddingBottom: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  dropdownText: {
    fontSize: wp(16),
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  modalPaddingStyles: {
    padding: wp(0),
    margin: wp(0),
  },
  closeModal: {
    height: '50%',
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
  hospitalName: {
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.md,
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
  slotTimeTouchableView: {
    paddingTop: wp(8),
    paddingBottom: wp(8),
  },
  button: {
    width: '100%',
    backgroundColor: APP_PRIMARY_COLOR,
    color: DEFAULT_WHITE_COLOR,
    borderRadius: wp(6),
    elevation: 0,
    borderWidth: wp(1),
    borderColor: APP_PRIMARY_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: DEFAULT_WHITE_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
  },
  marginTop10: {
    marginTop: wp(10),
  },
  footerBorder: {
    borderTopWidth: wp(1),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
});
