import {StyleSheet} from 'react-native';
import {theme} from '../../../themes/Theme';
import {wp, hp} from '../../../themes/Scale';
import {
  APP_PRIMARY_BACKGROUND_COLOR,
  DEFAULT_WHITE_COLOR,
  INPUT_BORDER_COLOR,
  PICKER_TEXT_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
} from '../../../themes/variable';

export default StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: wp(10),
  },
  eachInputFieldView: {
    marginBottom: wp(15),
  },
  inputField: {
    paddingLeft: wp(10),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: 'row',
    fontSize: theme.fontSizes.md,
    height: hp(50),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  pickerField: {
    paddingLeft: 0,
    justifyContent: 'flex-start'
  },
  heAlphaHealthForumsText: {
    color: PICKER_TEXT_COLOR,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fontFamily.primaryBold,
  },
  subText: {
    color: PICKER_TEXT_COLOR,
    fontSize: theme.fontSizes.xs1,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  flex: {
    flex: 1,
  },
  forumsIllustrationView: {
    height: '40%',
    width: '100%',
    backgroundColor: APP_PRIMARY_BACKGROUND_COLOR,
    position: 'absolute',
  },
  forumIllustrationImageView: {
    flex: 1,
    alignItems: 'center',
    marginTop: wp(15),
  },
  forumSectionMarginTop: {
    marginTop: '45%',
  },
  pickerText: {
    color: PICKER_TEXT_COLOR,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  searchField: {
    paddingLeft: wp(10),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: 'row',
    fontSize: theme.fontSizes.sm,
    height: hp(50),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  height75: {
    height: '75%',
  },
  dropdown4BtnStyle: {
    width: 'auto',
    //height: "auto",
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: 56,
    marginTop:-2
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});
