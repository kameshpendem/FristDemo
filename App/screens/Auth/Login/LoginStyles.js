import {StyleSheet} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_BLACK_COLOR,
} from '../../../themes/variable';
import {theme} from '../../../themes/Theme';
import {wp} from '../../../themes/Scale';

const textInputStyles = {
  borderColor: DEFAULT_GREY_COLOR,
  borderBottomWidth: 1.5,
  height: 40,
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
};

export const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  imgBg: {},
  safeTop: {
    backgroundColor: APP_PRIMARY_COLOR,
  },
  safeArea: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    flex: 1,
  },
  topSec: {
    marginBottom: -25,
    paddingBottom: 25,
    flex: 1,
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 30,
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoTextView: {},
  logoSec: {
    marginBottom: -10,
    flexDirection: 'row',
  },
  logoView: {
    flex: 1,
  },
  closeIconView: {
    paddingTop: 10,
  },
  closeIconImg: {
    color: DEFAULT_WHITE_COLOR,
  },
  logoImg: {
    width: 150,
    height: 50,
  },
  logoSecText: {
    color: DEFAULT_WHITE_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: 14,
  },
  midImgSec: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
});

export const botSecStyles = StyleSheet.create({
  bottomSec: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 35,
    paddingVertical: 20,
    zIndex: 2,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
  },
  bottomHeadingSec: {
    marginBottom: 15,
  },
  bottomSecHeading: {
    fontSize: 20,
    fontFamily: theme.fontFamily.primarySemiBold,
    textDecorationColor: DEFAULT_TEXT_COLOR,
  },
  bottomSecSubHeading: {
    fontSize: 14,
    fontFamily: theme.fontFamily.primaryRegular,
    textDecorationColor: DEFAULT_TEXT_COLOR,
    marginTop: 5,
    marginLeft: -3,
  },
  bottomSecText: {
    fontSize: 16,
  },
  bottomSecBtnView: {
    flexDirection: 'row',
  },
  baseButton: {
    width: '100%',
    backgroundColor: APP_PRIMARY_COLOR,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 4,
    justifyContent: 'center',
  },
  btnText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 16,
  },
  filledButton: {
    width: '100%',
    backgroundColor: APP_PRIMARY_COLOR,
  },
  tosSec: {
    marginBottom: 10,
    marginTop: 20,
  },
  tosText: {
    fontSize: 14,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  tosTextHighlight: {
    textDecorationColor: DEFAULT_TEXT_COLOR,
    fontSize: 14,
    fontFamily: theme.fontFamily.primaryBold,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: DEFAULT_GREY_COLOR,
    flex: 1,
    height: 1,
  },
  hrViewText: {
    textAlign: 'center',
    color: DEFAULT_GREY_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  loginOTPSec: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tprBtnText: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: 14,
  },
});

export const formStyles = StyleSheet.create({
  formSec: {
    marginTop: 10,
  },
  selectItemWrap: {
    paddingLeft: 5,
  },
  itemWrap: {
    marginLeft: 0,
    position: 'relative',
  },
  fieldIconView: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  downIcon: {
    color: DEFAULT_GREY_COLOR,
    marginLeft: 2,
  },
  fieldIconViewLeft: {
    left: 0,
    alignItems: 'center',
  },
  flagImg: {
    height: 20,
    width: 20,
  },
  textInputField: {
    paddingRight: 10,
  },
  textInputFieldLeftPad: {
    paddingLeft: 40,
  },
  disabledTextInputField: {
    color: DEFAULT_GREY_COLOR,
  },
  fieldIcon: {
    color: DEFAULT_GREY_COLOR,
  },
  eyeIcon: {
    color: DEFAULT_BLACK_COLOR,
  },
  userSelectView: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
  },
  userSelectTextSec: {
    flex: 1,
  },
  userSelectIconSec: {
    position: 'relative',
    alignItems: 'center',
  },
  formText: {
    color: DEFAULT_BLACK_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: 20,
  },
  userText: {
    color: DEFAULT_BLACK_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  noUserText: {
    color: DEFAULT_GREY_COLOR,
  },
  downArrowIcon: {
    color: DEFAULT_GREY_COLOR,
  },
  fPassView: {
    alignItems: 'flex-end',
  },
  fPassText: {
    color: APP_PRIMARY_COLOR,
    fontSize: 14,
    fontFamily: theme.fontFamily.primarySemiBold,
    letterSpacing: 0.15,
  },
  emailAndPhoneNumberText: {
    ...textInputStyles,
  },
  passwordInputText: {
    ...textInputStyles,
    marginTop: 10,
  },
  passwordIconStyles: {
    alignSelf: 'flex-end',
    marginTop: -35,
    marginRight: 10,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginTop: 15,
    color: APP_PRIMARY_COLOR,
    fontFamily: 'NunitoSans-Regular',
  },
  countryLabel: {
    borderBottomWidth: 1.5,
    borderColor: DEFAULT_GREY_COLOR,
    paddingTop: wp(10),
    paddingBottom: wp(10),
    paddingLeft: wp(5),
    flexDirection: 'row',
  },
  countryTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  dropdownArrow: {
    height: wp(20),
    width: wp(20),
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
});

export const choiceStyles = StyleSheet.create({
  bottomSec: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 35,
  },
  bottomSecText: {
    fontSize: 16,
  },
  countryCodeContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  countryCode: {
    textTransform: 'uppercase',
    color: APP_PRIMARY_COLOR,
  },
  bottomSecTextSec: {
    marginBottom: 15,
    display: 'flex',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSecBtnView: {
    flexDirection: 'row',
  },
  bottomSecBtnWrap: {
    flex: 1,
    paddingRight: 10,
  },
  baseButton: {
    width: '100%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 4,
    justifyContent: 'center',
  },
  outlineBtn: {
    color: APP_PRIMARY_COLOR,
  },
  btnText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 16,
  },
  outlineBtnText: {
    color: APP_PRIMARY_COLOR,
  },
  outlineBtnWrap: {
    paddingLeft: 5,
    paddingRight: 0,
  },
  filledButton: {
    width: '100%',
    backgroundColor: APP_PRIMARY_COLOR,
  },
  selectCountryMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp(10),
    alignItems: 'center',
  },
  selectCountryTextMainView: {
    flex: 1,
    justifyContent: 'center',
  },
  countrySecMargin: {
    marginTop: wp(10),
  },
  countrySelectionTouchableView: {
    flexDirection: 'row',
    marginTop: wp(10),
    paddingTop: wp(8),
    paddingBottom: wp(8),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    width: '48%',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: wp(15),
  },
  countryTextView: {
    flex: 1,
    paddingLeft: wp(5),
    justifyContent: 'center',
  },
  selectCountyText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
    color: APP_PRIMARY_COLOR,
  },
  dropdownArrow: {
    height: wp(25),
    width: wp(25),
  },
});
