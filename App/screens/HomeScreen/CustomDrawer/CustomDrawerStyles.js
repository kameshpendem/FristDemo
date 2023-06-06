import {StyleSheet} from 'react-native';
import {
  PROFILE_DRAWER_COLOR,
  CARD_SUB_TEXT_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../themes/variable';
import { wp } from "../../../themes/Scale";
import { theme } from '../../../themes/Theme';
export default StyleSheet.create({
  drawerWrapper: {
    flex: 1,
  },
  modalPaddingAndMargin: {
    padding: 0,
    margin: 0,
  },
  modalStylescomment: {
    marginTop: wp(-150),
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: wp(18),
    borderBottomLeftRadius: wp(18),
    borderBottomRightRadius: wp(18),
    borderTopRightRadius: wp(18),
    padding: wp(40),
    shadowColor: DEFAULT_WHITE_COLOR,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: wp(2),
    elevation: wp(5),
    borderColor: DEFAULT_GREY_COLOR,
  },
  searchmedicinecomment: {
    width: '100%',
    borderWidth: wp(1),
    marginTop: wp(20),
    borderRadius: wp(10),
    fontSize: theme.fontSizes.ml,
    color: 'black',
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  languageButtonStyles1: {
    width: '70%',
    marginLeft: 30,
    backgroundColor: APP_PRIMARY_COLOR,
    elevation: 0,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oktext: {
    fontSize: theme.fontSizes.ml,
    color: DEFAULT_WHITE_COLOR,
    lineHeight: 25,
    fontFamily: theme.fontFamily.primarySemiBold,
    textTransform: 'capitalize',
  },
  settingView: {
    minHeight: '20%',
    backgroundColor: PROFILE_DRAWER_COLOR,
    padding: 30,
    paddingTop: 50,
  },
  settingSectionWrapper: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 7,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  ImageTextSectionView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  sideArrowSectionView: {
    width: '20%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  ImageStyles: {
    height: 15,
    width: 15,
  },
  textStyles: {
    fontSize: 12,
    paddingLeft: 8,
  },
  textStylesOne: {
    fontSize: 12,
    paddingLeft: 8,
    marginTop:-16,
    marginLeft:20
  },
  sideArrowStyles: {
    height: 20,
    width: 20,
  },
  settingText: {
    fontSize: 12,
    marginBottom: 5,
    color: CARD_SUB_TEXT_COLOR,
  },
  menuView: {
    flex: 1,
    padding: 30,
    paddingTop: 20,
  },
  logoutSection: {
    paddingVertical: 20,
  },
  logoutAndFooterSection: {
    padding: 10,
    paddingLeft: 30,
    marginTop:-25,
    marginLeft:-10,
  },
  poweredBySection: {
    borderTopWidth: 1,
    borderTopColor: DEFAULT_LIGHT_GREY_COLOR,
    padding: 20,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoutImageStyles: {
    height: 20,
    width: 20,
  },
  poweredByText: {
    fontSize: 16,
    color: CARD_SUB_TEXT_COLOR,
    marginRight: 10,
  },
  healphaText: {
    color: APP_PRIMARY_COLOR,
  },
  flex: {
    flex: 1,
  },
  flexTouch: {
    flex: 1,
  },
  buttonsView: {
    paddingBottom: 10,
    flexDirection: 'row',
  },
  languageButtonStyles: {
    maxHeight: 30,
    width: 70,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  buttonText: {
    fontSize: 10,
    color: DEFAULT_WHITE_COLOR,
    textTransform: 'capitalize',
  },
});
