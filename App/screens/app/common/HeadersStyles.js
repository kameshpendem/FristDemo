import {StyleSheet, StatusBar, Platform} from 'react-native';
import {hp, wp} from '../../../themes/Scale';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
} from '../../../themes/variable';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  CardAlign: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: Platform.OS === 'ios' ? hp(100) : hp(70),
  },
  headingStyle: {
    flexDirection: 'row',
    // height: Platform.OS === "ios" ? 0 : "100%",
    backgroundColor: APP_PRIMARY_COLOR,
    flex: 1,
  },
  backArrow: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backArrowImage: {
    tintColor: DEFAULT_WHITE_COLOR,
    position: 'relative',
    left: 12,
    height: hp(25),
    width: wp(25),
    marginRight: 20,
    marginLeft: -20,
  },
  title: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 18,
    marginLeft: -145,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
  },
  titleDetails: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 18,
    marginLeft: -165,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
  },
  search: {flexDirection: 'row'},
  searchStyle: {marginLeft: 10},
  searchImage: {
    height: hp(25),
    width: wp(25),
    margin: 10,
    tintColor: DEFAULT_WHITE_COLOR,
  },
  searchBox: {
    marginLeft: wp(-155),
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    color: DEFAULT_WHITE_COLOR,
    marginTop: Platform.OS === 'ios' ? wp(18) : wp(0),
    textTransform: 'capitalize',
  },
  close: {marginLeft: 10},
  closeImage: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 22,
  },
});
