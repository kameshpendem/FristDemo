import {StyleSheet} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
} from '../../../themes/variable';
import {wp, hp} from '../../../themes/Scale';
import {theme} from '../../../themes/Theme';

export default StyleSheet.create({
  wrapper: {},
  input: {
    marginTop: wp(15),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderBottomWidth: 1.5,
    height: hp(50),
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginBottom: wp(15),
    marginHorizontal: wp(15),
  },
  footerStyles: {
    marginHorizontal: wp(15),
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  buttonStyles: {
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    elevation: 0,
    borderRadius: wp(6),
    backgroundColor: APP_PRIMARY_COLOR,
  },
  updateText: {
    fontSize: theme.fontSizes.md,
    color: DEFAULT_WHITE_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  marginHorizontal: {
    marginHorizontal: wp(15),
  },
  marginTop: {
    marginTop: wp(5),
  },
  passwordSpecificTextStyles: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },

  activePasswordSpecificTextStyles: {
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },

  marginBottom: {
    marginBottom: wp(5),
  },
  flexDirection: {
    flexDirection: 'row',
  },
});
