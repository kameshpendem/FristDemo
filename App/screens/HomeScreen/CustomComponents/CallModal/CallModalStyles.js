import {StyleSheet} from 'react-native';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  callModal: {
    height: '25%',
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
  },
  callModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10    
  },
  closeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callOption: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginLeft: 0,
    marginBottom: 10,
  },
  callIcons: {
    marginRight: 20,
  },
  callOptionStyles: {
    height: 22,
    width: 22,
  },
  callOptionText: {
    marginLeft: 10,
  },
  selectBelowOptionText: {},
});
