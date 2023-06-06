import {StyleSheet} from 'react-native';
import {
  PROFILE_DRAWER_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  CARD_SUB_TEXT_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  FONT_FAMILY,
  DEFAULT_GREY_COLOR,
  DEFAULT_BLACK_COLOR,
} from '../../../../themes/variable';

const modalStyles = {
  marginTop: 'auto',
  backgroundColor: DEFAULT_WHITE_COLOR,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  padding: 20,
  shadowColor: DEFAULT_WHITE_COLOR,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
  borderColor: DEFAULT_GREY_COLOR,
};

export default StyleSheet.create({
  drawerWrapper: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    // marginTop: 50,
    // backgroundColor: 'red',
  },
  settingView: {
    height: '20%',
    backgroundColor: PROFILE_DRAWER_COLOR,
    padding: 30,
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
    width: '80%',
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
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
  },
  sideArrowStyles: {
    height: 20,
    width: 20,
  },
  settingText: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    color: CARD_SUB_TEXT_COLOR,
  },
  changePracticeText: {
    fontSize: 10,
    marginBottom: -5,
    color: LIST_SUB_TEXT_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
  },
  menuView: {
    height: '65%',
    padding: 30,
    paddingTop: 20,
  },
  logoutSection: {
    height: '15%',
  },
  logoutAndFooterSection: {
    padding: 20,
    flex: 1,
  },
  poweredBySection: {
    borderTopWidth: 1,
    borderTopColor: DEFAULT_LIGHT_GREY_COLOR,
    flex: 1,
    padding: 20,
    paddingTop: 15,
    justifyContent: 'center',
  },
  logoutImageStyles: {
    height: 20,
    width: 20,
  },
  poweredByText: {
    fontSize: 16,
    color: CARD_SUB_TEXT_COLOR,
  },
  healphaText: {
    color: APP_PRIMARY_COLOR,
  },
  flex: {
    flex: 1,
  },
  buttonsView: {
    paddingBottom: 10,
    flexDirection: 'row',
  },
  languageButtonStyles: {
    height: 20,
    width: 50,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  buttonText: {
    fontSize: 12,
    color: DEFAULT_WHITE_COLOR,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  closeModal: {
    height: '30%',
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignContent: 'center',
  },
  touchableArea: {
    height: 20,
    width: 30,
  },
  closeImage: {
    height: 18,
    width: 18,
  },
  touchableView: {
    padding: 8,
    paddingLeft: 0,
    paddingBottom: 8,
  },
  languageMargin: {
    marginTop: 5,
  },
  languageText: {
    fontSize: 14,
    color: DEFAULT_BLACK_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
  },
});
