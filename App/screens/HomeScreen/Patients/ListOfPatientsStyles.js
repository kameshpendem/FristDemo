import {StyleSheet} from 'react-native';
import {wp} from '../../../themes/Scale';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  FONT_FAMILY,
} from '../../../themes/variable';
export default StyleSheet.create({
  scrollViewStyle: {marginBottom: wp(70)},
  screenPadding: {
    padding: wp(0),
  },
  onGoingOrderMainView: {
    marginTop: wp(5),
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    borderRadius: 10,
  },
  viewStyle: {
    marginTop: 10,
  },
  person: {marginLeft: wp(20)},
  personStyle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    color: '#151414',
  },
  personIcon: {fontSize: 18, alignSelf: 'center'},
  age: {marginLeft: wp(25), top: wp(-20)},
  email: {top: wp(-15)},
  emailStyle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    color: '#151414',
  },
  emailIcon: {fontSize: 18, alignSelf: 'center'},
  emailText: {marginLeft: wp(25), top: wp(-18)},
  emailTextStyle: {
    borderRightWidth: wp(1),
    width: wp(175),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    lineHeight: wp(15),
  },
  phone: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    color: '#151414',
  },
  phoneIcon: {fontSize: 18, alignSelf: 'center'},
  phoneTextView: {marginLeft: wp(25), top: wp(-20)},
  noData: {marginLeft: wp(80), top: wp(350)},
  noDataText: {color: APP_PRIMARY_COLOR, fontSize: wp(24)},
});
