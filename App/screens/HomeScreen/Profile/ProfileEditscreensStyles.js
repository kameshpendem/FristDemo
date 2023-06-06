import {StyleSheet} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  TEXT_INPUT_TITLE,
  DEFAULT_LIGHT_GREY_COLOR
} from '../../../themes/variable';
import {wp, hp} from '../../../themes/Scale.js';
import {theme} from '../../../themes/Theme.js';
export default StyleSheet.create({
  Profile: {
    textAlign: 'center',
    justifyContent: 'center',
    margin: wp(15),
  },
  ProfileText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  NameSection: {
    marginVertical: wp(10),
    marginTop: wp(36),
  },
  FirstNameView: {
    marginLeft: wp(16),
    marginRight: wp(16),
  },
  NameText: {
    fontSize: theme.fontSizes.sm,
    color: TEXT_INPUT_TITLE,
  },
  TextInputView: {
    marginLeft: wp(5),
    marginRight: wp(16),
  },
  TextInput: {
    height: hp(40),
    backgroundColor: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.md,
  },
  TextError: {
    fontSize: theme.fontSizes.xxs,
    fontWeight: '500',
    color: 'red',
  },
  PickerView: {
    marginLeft: wp(8),
    marginRight: wp(16),
  },
  BorderLine: {
    marginLeft: wp(16),
    marginRight: wp(16),
    backgroundColor: '#dcdcdc',
    height: hp(1),
  },
  Card: {
    // height: hp(52),
    // backgroundColor: 'red'
  },
  AddExperienceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: wp(16),
  },
  AddExperienceName: {
    fontSize: theme.fontSizes.ml,
    color: APP_PRIMARY_COLOR,
  },
  SquarePlus: {
    justifyContent: 'flex-end',
    marginRight: wp(16),
  },
  ExperienceNameSectionView: {
    marginLeft: wp(16),
    marginRight: wp(16),
    marginTop: wp(18),
    marginVertical: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CardView: {
    marginTop: wp(5),
    marginVertical: wp(10),
  },
  CrossIcon: {
    justifyContent: 'flex-end',
    marginRight: wp(16),
  },
  Designation: {
    marginLeft: wp(16),
    marginRight: wp(16),
    fontSize: theme.fontSizes.sm,
    marginVertical: wp(10),
    color: TEXT_INPUT_TITLE,
  },
  Checkbox: {
    marginLeft: wp(16),
    marginVertical: wp(10),
    marginRight: wp(16),
    flexDirection: 'row',
  },
  FromDate: {
    marginLeft: wp(16),
    marginRight: wp(16),
    marginVertical: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TillDate: {
    fontSize: theme.fontSizes.sm,
    // marginLeft: '20%',
    color: '#939393',
  },
  Year: {
    marginLeft: wp(5),
    marginRight: wp(16),
    paddingBottom: wp(10),
  },
  dateInputStyles: {
    borderWidth: wp(0),
    alignContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(10),
    borderBottomWidth: wp(1),
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  profileImageView: {
    height: wp(80),
    width: wp(80),
    borderRadius: 50,
  },
  selectDateView: {
    borderBottomWidth: wp(1),
    marginTop: wp(10),
    marginLeft: wp(5),
    marginRight: wp(16),
    // width: '80%',
    paddingBottom: wp(5),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  dateTex: {
    color: 'black',
    borderWidth: wp(0),
    borderBottomWidth: wp(1),
    alignContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(10),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  dateTillTex: {
    color: 'black',
    borderWidth: wp(0),
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: wp(10),
    // marginLeft: "20%",
    marginRight: wp(90),
    marginLeft: wp(-10)
  },
  dateFromTex: {
    color: 'black',
    // fontFamily: theme.fontFamily.primaryRegular,
    // fontSize: theme.fontSizes.sm,
    borderWidth: wp(0),
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // paddingLeft: wp(10),
    marginRight: "20%",
    padding:0
    // borderBottomWidth: wp(1),
  },
  selectFromDateView: {
    borderBottomWidth: wp(1),
    marginTop: wp(10),
    // marginLeft: wp(5),
    // marginRight: wp(16),
    // width: '80%',
    paddingBottom: wp(5),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  selectTillDateView: {
    borderBottomWidth: wp(1),
    marginTop: wp(10),
    // marginLeft: wp(5),
    // marginRight: wp(16),
    // width: '80%',
    paddingBottom: wp(5),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  dropdown4BtnStyle: {
    width: 'auto',
    //height: "auto",
    backgroundColor: '#FFF',
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: 40,
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},

});
