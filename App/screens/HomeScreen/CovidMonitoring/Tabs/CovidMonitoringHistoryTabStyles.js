import {StyleSheet} from 'react-native';
import {
  DEFAULT_WHITE_COLOR,
  // ORANGE_COLOR,
  DEFAULT_GREY_COLOR,
  TABLE_HEADER_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  CARD_SUB_TEXT_COLOR,
  LIST_SUB_TEXT_COLOR,
  TABLE_ODD_ROW_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  LEFT_TABLE_BACKGROUND_COLOR,
  DEFAULT_BLACK_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  historyScreenMainWrapper: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    overflow: 'scroll',
    width: '100%',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dateSectionMainView: {
    width: '100%',
    overflow: 'scroll',
    height: '20%',
  },
  dateSectionsView: {
    flexDirection: 'row',
  },
  dateSectionTextMainView: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  dateMainView: {
    flexDirection: 'row',
    width: '80%',
    // borderWidth: 3,
    // borderColor: ORANGE_COLOR,
    paddingLeft: '10%',
    height: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  dateInputsView: {
    width: '20%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  datesView: {
    transform: [{rotate: '270deg'}],
  },
  textTransform: {
    transform: [{rotate: '270deg'}],
    fontSize: 10,
    color: DEFAULT_GREY_COLOR,
  },
  horizontalLine: {
    borderBottomColor: DEFAULT_GREY_COLOR,
    borderBottomWidth: 1,
    // marginTop: 5,
    // width: '100%',
    flex: 1,
    opacity: 0.3,
  },
  dateText: {
    transform: [{rotate: '270deg'}],
    fontSize: 12,
    fontWeight: 'bold',
  },

  section: {
    overflow: 'scroll',
    flexDirection: 'row',
    marginTop: 10,
  },
  SectionTextView: {
    flexDirection: 'row',
    width: '29%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  sectionTextView: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputSection: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 3,
    paddingBottom: 3,
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },

  mainView: {
    flex: 1,
    flexDirection: 'row',
  },
  leftView: {
    width: '40%',
  },
  leftViewFlex: {
    flex: 1,
  },
  leftViewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    display: 'flex',
    paddingTop: 8,
    paddingBottom: 8,
  },
  rightView: {
    flex: 1,
    overflow: 'scroll',
  },
  // inputMain: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignContent: 'center',
  //   alignItems: 'center',
  // },
  tableMainView: {
    flex: 1,
    marginTop: 10,
  },
  borderZero: {
    borderWidth: 0,
  },
  tableHeaderStyles: {
    height: 80,
    backgroundColor: TABLE_HEADER_COLOR,
  },
  headerTextStyles: {
    textAlign: 'center',
    transform: [{rotate: '270deg'}],
    fontSize: 10,
  },
  columnTextStyles: {
    fontSize: 10,
    textAlign: 'center',
  },
  columnHeaderStyles: {
    flex: 1,
    backgroundColor: TABLE_HEADER_COLOR,
    // fontSize: 8
  },
  rowStyle: {
    height: 45,
    marginTop: 0.5,
  },
  rowText: {
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
  rowData: {
    height: 80,
    borderWidth: 0,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    fontSize: 12,
  },
  tableHeaders: {
    textAlign: 'center',
    fontWeight: '100',
    transform: [{rotate: '-90deg'}],
    fontSize: 12,
  },

  negativeMargin: {
    marginTop: -1,
  },
  columnHeaderStyle: {
    borderWidth: 0,
    borderColor: 'white',
  },
  columnText: {
    marginTop: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontWeight: '100',
    height: 45,
  },
  tableColumnsText: {
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: CARD_SUB_TEXT_COLOR,
  },
  textColor: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 14,
  },
  columnStyles: {
    paddingTop: 3,
    paddingBottom: 3,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  evenIndexStyles: {
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  evenIndexStylesElse: {
    backgroundColor: TABLE_ODD_ROW_COLOR,
    borderWidth: 0.2,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  oddIndexPadding: {
    paddingBottom: 7,
    paddingTop: 7,
  },

  // updated table styles

  tableWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  width120: {
    width: 120,
  },

  dateCellView: {
    height: 70,
    backgroundColor: TABLE_HEADER_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  tableDateText: {
    fontSize: 13,
    transform: [{rotate: '270deg'}],
  },
  leftScrollViewStyle: {
    flex: 1,
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  leftTableBorderStyles: {
    borderWidth: 1,
    borderColor: TABLE_HEADER_COLOR,
  },
  leftTableRowStyles: {
    backgroundColor: LEFT_TABLE_BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft:10
  },
  rowHeight: {
    height: 40,
  },
  evenIndexBackgroundColor: {
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  oddIndexBackgroundColor: {
    backgroundColor: TABLE_ODD_ROW_COLOR,
  },
  tableZeroIndexStyles: {
    borderTopWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  leftTableTextStyles: {
    fontSize: 13,
    color: DEFAULT_BLACK_COLOR,
  },
  rightTableView: {
    flex: 1,
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  rightTableBorderStyles: {
    borderWidth: 1,
    borderColor: TABLE_HEADER_COLOR,
  },
  rightTableHead: {
    height: 70,
    backgroundColor: TABLE_HEADER_COLOR,
  },
  rightTableText: {
    textAlign: 'center',
    color: DEFAULT_BLACK_COLOR,
    fontSize: 13,
    transform: [{rotate: '270deg'}],
  },
  dateWrapper: {
    marginTop: -1,
  },
  rightTableRowStyles: {
    backgroundColor: LEFT_TABLE_BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  textAlign: {
    textAlign: 'center',
  },
  inputMain: {},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
