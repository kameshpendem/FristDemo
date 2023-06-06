import {StyleSheet} from 'react-native';

import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  CARD_SUB_TEXT_COLOR,
  PICKER_BORDER_COLOR,
  PICKER_BACKGROUND_COLOR,
  PICKER_TEXT_COLOR,
} from '../../../../themes/variable';
import {theme} from '../../../../themes/Theme';
import {hp, wp} from '../../../../themes/Scale';

export default StyleSheet.create({
  modalMargins: {
    padding: 0,
    margin: 0,
  },
  modalStyles: {
    height: '50%',
    maxHeight: '50%',
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: wp(30),
    borderTopRightRadius: wp(30),
    padding: wp(15),
    paddingTop: wp(25),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLabel: {
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primarySemiBold,
    color: CARD_SUB_TEXT_COLOR,
  },
  modalHeaderDescription: {
    fontSize: theme.fontSizes.sm1,
    fontFamily: theme.fontFamily.primaryRegular,
    color: LIST_SUB_TEXT_COLOR,
  },
  cancelIcon: {
    width: 24,
    height: 24,
  },
  inputFieldsView: {
    marginBottom: 10,
  },
  eachInputFieldView: {
    marginTop: wp(15),
  },
  inputFieldLabel: {
    fontSize: 15,
    paddingBottom: 5,
    color: LIST_SUB_TEXT_COLOR,
  },
  inputField: {
    paddingLeft: wp(10),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: PICKER_BORDER_COLOR,
    backgroundColor: PICKER_BACKGROUND_COLOR,
    flexDirection: 'row',
    fontSize: theme.fontSizes.md,
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  pickerField: {
    paddingLeft: 0,
  },
  agreeView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingBottom: wp(10),
  },
  agreeText: {
    fontSize: theme.fontSizes.sm1,
    textAlign: 'center',
    fontFamily: theme.fontFamily.primaryRegular,
    color: PICKER_TEXT_COLOR,
  },
  termsOfService: {
    color: APP_PRIMARY_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: theme.fontSizes.sm1,
  },
  input: {
    paddingLeft: wp(10),
    borderRadius: wp(6),
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: 'row',
    fontSize: theme.fontSizes.md,
    height: hp(150),
  },
  pickerText: {
    color: PICKER_TEXT_COLOR,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
});
