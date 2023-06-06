import {StyleSheet, StatusBar} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  DEFAULT_BLACK_COLOR,
} from '../../../../themes/variable';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default StyleSheet.create({
  head: {flex: 1},
  lab: {margin: 10},
  deleteIcon: {
    fontSize: 20,
    color: APP_PRIMARY_COLOR,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 15,
  },
  headings: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },

  row: {flexDirection: 'row'},
  search: {flex: 1, position: 'relative'},
  data: {position: 'absolute', top: 120, zIndex: 999, width: '100%'},
  vaccineName: {
    padding: 15,
    marginHorizontal: 15,
    elevation: 4,
    backgroundColor: DEFAULT_WHITE_COLOR,
    color: DEFAULT_BLACK_COLOR,
  },
  divide: {height: 1, backgroundColor: '#e1e8ee'},
  brandName: {
    flexDirection: 'row',
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
    justifyContent: 'space-between',
  },
  back: {backgroundColor: DEFAULT_WHITE_COLOR},
  gap: {height: 10, backgroundColor: 'rgb(247,247,247)'},
  medicineview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicinetext: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 5,
  },
});
