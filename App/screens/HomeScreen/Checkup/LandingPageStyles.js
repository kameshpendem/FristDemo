import {StyleSheet} from 'react-native';
import {theme} from '../../../themes/Theme';
import {hp, wp} from '../../../themes/Scale';

import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_SHADOW_COLOR,
  CARD_TEXT_COLOR,
  CARD_SUB_TEXT_COLOR,
  APP_PRIMARY_BACKGROUND_COLOR,
} from '../../../themes/variable';

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

const cardStyles = {
  flex: 1,
  borderWidth: 1.5,
  borderColor: DEFAULT_LIGHT_GREY_COLOR,
  backgroundColor: DEFAULT_WHITE_COLOR,
  borderRadius: 8,
  flexDirection: 'row',
  marginBottom: 10,
  shadowColor: DEFAULT_SHADOW_COLOR,
  shadowOffset: {
    height: 3,
    width: 0,
  },
  shadowOpacity: 0.9,
  shadowRadius: 1,
  elevation: 1,
};

export default StyleSheet.create({
  mainContainer: {
    // flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  info: {
    fontSize: 14,
    marginTop: 5,
    color: '#696969',
  },
  subtext: {
    fontSize: 14,
    color: '#696969',
  },
  bodyContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBox: {
    width: '30%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    // elevation: 4
  },
  icon: {
    width: 80,
    height: 100,
  },
  icon1: {
    width: 100,
    height: 100,
  },
  bottomIcon: {
    width: 80,
    height: 100,
  },
  doctorNameText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 15,
    paddingLeft: 5,
  },
  headerStyles: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: 60,
  },
  headerMainView: {
    flex: 1,
    flexDirection: 'row',
  },
  headerTextView: {
    width: '60%',
  },
  textColumnView: {
    alignItems: 'flex-start',
    alignContent: 'center',
    justifyContent: 'center',
  },
  profileAndNotificationView: {
    marginRight: 20,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    width: '40%',
  },
  itemsCenter: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  itemsEnd: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  marginRight20: {
    marginRight: 20,
  },
  profileIconStyles: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: DEFAULT_BLACK_COLOR,
    alignSelf: 'flex-end',
  },
  notificationIconStyles: {
    height: 20,
    width: 20,
  },
  imageView: {
    height: '20%',
    backgroundColor: APP_PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  imageBackgroundStyles: {
    height: '100%',
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  closeModal: {
    height: '50%',
    ...modalStyles,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
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
  closeImage: {
    height: 18,
    width: 18,
  },
  hospitalSectionMainView: {
    paddingLeft: 16,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  hospitalTextView: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  hospitalText: {
    fontSize: 16,
  },
  changeButtonView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    display: 'flex',
  },
  actionsMainView: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  appointmentMainView: {
    padding: 10,
    ...cardStyles,
  },
  touchableStyles: {
    flexDirection: 'row',
    flex: 1,
  },
  cardNameAndImageSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  cardText: {
    fontSize: 14,
    color: CARD_TEXT_COLOR,
  },
  imageStyles: {
    height: 30,
    width: 30,
    marginTop: 10,
  },
  cardNumberTextView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  textNumberMainView: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  textViewWidth: {
    width: '70%',
  },
  textStyles: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: 12,
  },
  numberView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  numberTextStyles: {
    fontSize: 14,
    color: APP_PRIMARY_COLOR,
    marginRight: 10,
  },
  imageTextCenterAlign: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  forumsAndHelpImageStyles: {
    height: 40,
    width: 40,
  },
  forumSectionMainView: {
    padding: 15,
    ...cardStyles,
    borderWidth: 0,
    elevation: 0,
    backgroundColor: APP_PRIMARY_BACKGROUND_COLOR,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  marginRight5: {
    marginRight: 5,
  },
  marginLeft5: {
    marginLeft: 5,
  },
  headerBarMainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  headerNameView: {
    width: '70%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  profileNotificationMainView: {
    flex: 1,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notificationView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  touchableView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  containerStyles: {
    height: '100%',
    width: '100%',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  flex1: {
    flex: 1,
  },
  touchableArea: {
    height: 20,
    width: 30,
  },

  heAlphaHealthForums: {
    color: '#1D1D24',
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.md,
  },
  AskAndDiscussText: {
    color: '#1D1D24',
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.xs,
  },
  askQuestionButtonText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  askQuestionButton: {
    height: hp(35),
    padding: wp(12),
    marginTop: wp(10),
    borderRadius: wp(5),
    backgroundColor: APP_PRIMARY_COLOR,
  },
  forumsImageView: {
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  illusTab: {
    flex: 1,
    backgroundColor: '#E7EEF0',
  },
  illusTabView: {
    backgroundColor: '#E7EEF0',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
  },
  illusMainView: {
    padding: 0,
    // marginHorizontal: 15,
  },
  illusSec: {
    justifyContent: 'flex-end',
  },
  emptyView: {
    height: 70,
  },
  contentSec: {
    // flex: 1,
  },
  forumIllsImg: {
    width: 120,
    height: 80,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  illusHeading: {
    // lineHeight: 24,
    fontSize: theme.fontSizes.md,
    letterSpacing: 0.18,
    color: DEFAULT_BLACK_COLOR,
    fontFamily: theme.fontFamily.primaryBold,
    marginBottom: wp(2),
  },
  illusSubHeading: {
    lineHeight: 18,
    fontSize: theme.fontSizes.xs1,
    letterSpacing: 0.14,
    color: DEFAULT_BLACK_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  illusBtn: {
    backgroundColor: APP_PRIMARY_COLOR,
    paddingHorizontal: 15,
    height: 30,
  },
  illusBtnText: {
    lineHeight: 18,
    fontSize: 14,
    letterSpacing: 0.14,
    color: DEFAULT_WHITE_COLOR,
  },
  illusBtnWrap: {
    marginTop: 10,
  },
});
