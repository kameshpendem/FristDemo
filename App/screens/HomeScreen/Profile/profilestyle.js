import {StyleSheet} from 'react-native';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import {hp, wp} from '../../../themes/Scale.js';
import {theme} from '../../../themes/Theme.js';
export default StyleSheet.create({
  headerleft: {
    flexDirection: 'row',
  },
  headertitle: {
    marginLeft: wp(10),
    color: DEFAULT_WHITE_COLOR,
  },
  headerbgcolor: {
    backgroundColor: APP_PRIMARY_COLOR,
  },
  profilecard: {
    marginTop: wp(0),
    backgroundColor: APP_PRIMARY_COLOR,
  },
  profilename: {
    fontWeight: 'bold',
    fontSize: theme.fontSizes.ml,
    color: DEFAULT_WHITE_COLOR,
    padding: wp(2),
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  profileText: {
    fontSize: theme.fontSizes.xs,
    color: DEFAULT_WHITE_COLOR,
    padding: wp(2),
    fontFamily: theme.fontFamily.primaryRegular,
  },
  Aboutcard: {
    marginTop: wp(0),
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(10),
    paddingBottom: wp(10),
    elevation: 0,
    borderWidth: wp(0),
  },
  AboutView: {
    marginLeft: wp(16),
    marginRight: wp(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  AboutText: {
    fontSize: theme.fontSizes.sm1,
    color: '#151414',
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  AboutBriefText: {
    marginTop: wp(5),
    marginRight: wp(16),
    marginLeft: wp(16),
  },
  Aboutstyle: {
    fontSize: 12.5,
    flexDirection: 'row',
    fontFamily: theme.fontFamily.primaryRegular,
  },
  Textmore: {
    marginTop: wp(3),
    color: APP_PRIMARY_COLOR,
    fontSize: 12.5,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  detailscard: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(10),
    paddingBottom: wp(10),
    elevation: 0,
  },
  detailsview: {
    marginLeft: wp(16),
    marginRight: wp(16),
    flexDirection: 'row',
    margin: wp(8),
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  Detailsicon1: {
    height: hp(26),
    width: wp(26),
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    borderRadius: wp(10),
    alignContent: 'center',
    alignItems: 'center',
  },
  Detailsicon1Text: {
    marginLeft: wp(8),
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
  },

  Detailsicon2: {
    height: 26,
    width: 26,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  Detailsicon2Text: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'NunitoSans-Regular',
  },
  experiencecard: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingTop: wp(10),
    paddingBottom: wp(10),
    elevation: 0,
  },
  experienceText: {
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
  educationcard: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: wp(10),
    paddingBottom: wp(10),
  },
  certicatescard: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: wp(10),
    paddingBottom: wp(10),
    elevation: 0,
  },
  languageicon: {
    height: hp(26),
    width: wp(26),
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    borderRadius: wp(8),
  },
  languageText: {
    marginLeft: wp(8),
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  profileImageStyles: {
    height: wp(80),
    width: wp(80),
    borderRadius: 50,
  },
});
