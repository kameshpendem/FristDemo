import {StyleSheet} from 'react-native';
import {wp} from '../../../../themes/Scale';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  LIST_SUB_TEXT_COLOR,
} from '../../../../themes/variable';
import {theme} from '../../../../themes/Theme';

export default StyleSheet.create({
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  callModal: {
    height: '25%',
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: wp(15),
    borderTopRightRadius: wp(15),
    padding: wp(20),
    shadowColor: DEFAULT_WHITE_COLOR,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: wp(2),
    elevation: wp(2),
    borderColor: DEFAULT_GREY_COLOR,
  },
  callModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp(10),
    fontFamily: theme.fontFamily.secondaryMedium
  },
  closeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callOption: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: wp(5),
    marginLeft: 0,
    marginBottom: wp(10),
  },
  callIcons: {
    marginRight: wp(20),
  },
  callOptionStyles: {
    height: wp(22),
    width: wp(22),
  },
  callOptionText: {
    marginLeft: wp(10),
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primarySemiBold,
  },
  callOptionSubText: {
    marginLeft: wp(10),
    fontSize: wp(16),
    fontFamily: theme.fontFamily.primaryRegular,
    color: LIST_SUB_TEXT_COLOR,
  },
  selectBelowOptionText: {},
});
