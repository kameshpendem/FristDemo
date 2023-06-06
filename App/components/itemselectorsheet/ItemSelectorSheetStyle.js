import {StyleSheet} from 'react-native';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREEN_COLOR,
  APP_PRIMARY_COLOR,
  FONT_FAMILY_REGULAR,
} from '../../themes/variable';

const modalContentPaddingRight = 30;
const modalContentPaddingLeft = 30;
export const styles = StyleSheet.create({
  clinicSelectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downSelectIcon: {
    marginLeft: 10,
    paddingTop: 3,
  },
  modalWrapperView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    paddingTop: 30,
    paddingBottom: 30,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxHeight: '60%',
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: DEFAULT_TEXT_COLOR,
    fontFamily: FONT_FAMILY_REGULAR,
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  listWrapper: {
    width: '100%',
    overflow: 'scroll',
    paddingBottom: 30,
  },
  listItem: {
    paddingRight: modalContentPaddingRight,
    paddingLeft: modalContentPaddingLeft,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 7,
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
  },
  listItemText: {
    color: DEFAULT_TEXT_COLOR,
    fontFamily: FONT_FAMILY_REGULAR,
    flex: 1,
    fontSize: 16,
    paddingTop: 5,
  },
  listSelectedMarker: {
    marginLeft: 20,
  },
  headerSec: {
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  titleView: {
    flex: 1,
  },
  closeIconView: {
    alignItems: 'center',
  },
  closeIconImg: {
    color: DEFAULT_BLACK_COLOR,
  },
  checkIcon: {
    color: APP_PRIMARY_COLOR,
  },
});
