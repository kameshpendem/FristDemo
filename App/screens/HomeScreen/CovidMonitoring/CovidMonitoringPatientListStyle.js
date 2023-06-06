import {StyleSheet} from 'react-native';

import {
  DEFAULT_GREEN_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  CARD_SUB_TEXT_COLOR,
  LIST_SUB_TEXT_COLOR,
  APP_PRIMARY_COLOR,
  CARD_BUTTON_BACKGROUND_COLOR,
  COUNTS_BACK_GROUND_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../../../themes/variable';

const modalStyles = {
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
};

export default StyleSheet.create({
  container: {
    // padding: 15,
    // paddingTop: 0,
    // paddingBottom: 0,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 3,
  },
  title: {
    fontSize: 14,
    color: CARD_SUB_TEXT_COLOR,
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 18,
  },
  inputFieldsRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFieldFilter: {
    flex: 3,
  },
  inputFieldSearch: {
    flex: 3,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientListView: {
    marginTop: 10,
    marginBottom: 120,
    padding: 15,
    paddingTop: 0,
  },
  patientCardView: {
    flex: 1,
  },
  patientCardItemView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
    borderBottomWidth: 1,
  },
  actionCardItemView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailsView: {
    flexDirection: 'row',
  },
  detailsTextView: {
    flex: 5,
    marginRight: 10,
  },
  patientNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CARD_SUB_TEXT_COLOR,
    textTransform: 'capitalize',
  },
  phoneNumberText: {
    fontSize: 12,
    color: LIST_SUB_TEXT_COLOR,
  },
  reviewsView: {
    height: 30,
  },
  reviewsCountView: {
    flexDirection: 'row',
    margin: 5,
    marginLeft: 0,
    marginRight: 10,
  },
  actionsView: {
    width: '100%',
  },
  eachActionRowView: {
    flexDirection: 'row',
  },
  firstActionButton: {
    width: '40%',
  },
  largeActionButton: {
    flex: 6,
  },
  smallActionButton: {
    flex: 3,
  },
  button: {
    margin: 4,
    marginRight: 8,
    marginLeft: 0,
    padding: 12,
    paddingLeft: 10,
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 40,
  },
  reviewButton: {
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 3,
    paddingLeft: 8,
    paddingRight: 8,
    color: DEFAULT_WHITE_COLOR,
    backgroundColor: CARD_BUTTON_BACKGROUND_COLOR,
  },
  reviewButtonText: {
    fontSize: 14,
    color: APP_PRIMARY_COLOR,
  },
  countButtonText: {
    fontSize: 11.5,
    color: CARD_SUB_TEXT_COLOR,
    backgroundColor: COUNTS_BACK_GROUND_COLOR,
    borderRadius: 3,
    padding: 2,
  },
  countsMargin: {
    marginRight: 4,
  },
  actionButton: {
    borderWidth: 1,
    backgroundColor: CARD_BUTTON_BACKGROUND_COLOR,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 3,
  },
  activeActionButton: {
    borderWidth: 1,
    backgroundColor: APP_PRIMARY_COLOR,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 3,
  },
  actionButtonText: {
    color: APP_PRIMARY_COLOR,
    fontSize: 14,
  },
  activeActionButtonText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 14,
  },
  actionButtonIcon: {
    fontSize: 12,
  },
  callView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  callImageStyles: {
    height: 18,
    width: 18,
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
    marginBottom: 10,
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
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  closeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIconStyles: {
    height: 18,
    width: 18,
  },

  closeModal: {
    height: '60%',
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
    paddingBottom: 15,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeView: {
    flex: 1,    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'    
  },
  closeImage: {
    height: 18,
    width: 18,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  yesInfoText: {
    fontSize: 13,
    color: DEFAULT_WHITE_COLOR,
    textAlign: 'center',
  },
  infoTextView: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
    marginBottom: 0,
  },
  fontSize14: {
    fontSize: 14,
  },
  textInputStyles: {
    height: 75,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    borderRadius: 6,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    marginTop: 0,
  },
  noActionButton: {
    width: 60,
    marginRight: 10,
    backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
    padding: 10,
    borderRadius: 6,
  },
  yesActionButton: {
    width: 60,
    padding: 10,
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: 6,
  },
  preDefinedCommentView: {
    borderColor: DEFAULT_GREY_COLOR,
    marginLeft: 0,
  },
  touchableArea: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    paddingRight: 4,
  },
  commentsView: {
    marginLeft: 3,
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
  },
  searchAndFilterSectionMainView: {
    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
    borderBottomWidth: 2,
  },
  flexDirection: {
    flexDirection: 'row',
  },
  searchTouchableView: {
    flex: 1,
    borderRightColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRightWidth: 1,
  },
  searchAndFilterMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  filterSectionTouchableView: {
    flex: 1,
  },
  searchFilterText: {
    fontSize: 14,
    color: CARD_SUB_TEXT_COLOR,
  },
  searchFilterImageStyles: {
    height: 20,
    width: 20,
    marginTop: 2,
  },
  backArrowStyles: {
    height: 25,
    width: 25,
  },
  closeIcon: {
    height: 15,
    width: 15,
  },
  backArrowTouchablePadding: {
    marginRight: 10,
  },
  closeArrowTouchablePadding: {
    marginRight: 10,
  },
  searchMainView: {
    padding: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  searchInputStyles: {
    flex: 1,
    height: 45,
    fontSize: 14,
  },
  filterModal: {
    height: '50%',
    ...modalStyles,
  },
  doctorViewStyles: {
    marginTop: 5,
  },
  clearTextStyles: {
    fontSize: 14,
    color: APP_PRIMARY_COLOR,
    paddingRight: 20,
  },
  filterTouchable: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    marginBottom: 10
  },
  dateIconStyles: {
    height: 20,
    width: 20,
  },
  cardPaddingStyles: {
    paddingLeft: 10,
    paddingRight: 2,
    paddingTop: 7,
    paddingBottom: 7,
  },
  searchButtonStyles: {
    width: '50%',
    height: 45,
    borderRightWidth: 1,
    elevation: 0,
    borderRadius: 0,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  filterButtonStyles: {
    width: '50%',
    height: 45,
    elevation: 0,
    borderRadius: 0,
    backgroundColor: DEFAULT_WHITE_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  clearAllButton: {    
    marginRight: 10,
  },
  closeButton: {
    height: 20,
    marginTop: 10
  },
  backArrowButtonStyles: {
    elevation: 0,
    width: '10%',
  },
});
