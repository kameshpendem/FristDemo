import {StyleSheet} from 'react-native';
import {wp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';
import {
  CARD_SUB_TEXT_COLOR,
  DEFAULT_WHITE_COLOR,
  INPUT_BORDER_COLOR,
  LIST_SUB_TEXT_COLOR,
} from '../../../../themes/variable';
export default StyleSheet.create({
  modalMargins: {
    padding: 0,
    margin: 0,
  },
  modalStyles: {
    height: '35%',
    maxHeight: '35%',
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLabel: {
    fontSize: theme.fontSizes.md1,
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  cancelIcon: {
    width: 24,
    height: 24,
  },
  inputFieldsView: {
    marginBottom: 50,
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
    borderColor: INPUT_BORDER_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: 'row',
    fontSize: theme.fontSizes.md1,
  },
});
