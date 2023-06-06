import {StyleSheet} from 'react-native';

import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_BLUE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_BLACK_COLOR,
  CARD_BUTTON_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  REVIEW_NOTES_BACKGROUND_TEXT_COLOR,
  CARD_SUB_TEXT_COLOR,
  PHYSIOTHERAPIST_BACKGROUND_COLOR,
  DIETICIAN_BACKGROUND_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  filtersView: {
    marginBottom: 5,
  },
  filterLabel: {
    color: DEFAULT_BLACK_COLOR,
    fontWeight: '900',
  },
  filterSelectView: {
    flexDirection: 'row',
    marginLeft: 3,
  },
  filtersButton: {
    padding: 5,
    margin: 5,
    marginLeft: 0,
    borderWidth: 1.3,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 3,
    backgroundColor: CARD_BUTTON_BACKGROUND_COLOR,
  },
  reviewsListView: {
    marginBottom: 60,
    flex: 1,
  },
  eachReviewView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  reviewInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingRight: 0,
  },
  nameDateView: {
    flex: 4,
  },
  roleView: {
    flex: 2,
    // justifyContent: 'center',
    paddingTop: 3,
    alignItems: 'flex-end',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CARD_SUB_TEXT_COLOR,
  },
  userType: {
    fontSize: 12,
    textTransform: 'capitalize',
    backgroundColor: DEFAULT_LIGHT_GREEN_COLOR,
    padding: 5,
    paddingTop: 0,
    paddingBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: DEFAULT_GREY_COLOR,
  },
  reviewDescView: {
    padding: 5,
    paddingTop: 0,
    justifyContent: 'center',
    paddingRight: 0,
  },
  footer: {
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  addReviewButtonView: {
    position: 'absolute',
    marginTop: 20,
    bottom: 0,
    right: 0,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  addReviewButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalContainerStyle: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    margin: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  standardReviewsView: {
    marginTop: 20,
  },
  standardReviewsTextView: {
    maxHeight: 200,
    marginTop: 5,
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRadius: 10,
  },
  predefinedNotesText: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
    paddingTop: 8,
    paddingBottom: 8,
  },
  customReviewView: {
    marginTop: 20,
  },
  checkBoxActionView: {
    marginTop: 20,
  },
  checkBoxAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadFileView: {
    flex: 2,
    padding: 10,
  },
  attachFileTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsView: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalActionCancelButton: {
    marginRight: 10,
    padding: 10,
  },
  modalActionSaveButton: {
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: 4,
    padding: 10,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  checkBoxesMainView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-end',
  },
  marginTop: {
    marginTop: 5,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  cardPaddingBottom: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    padding: 8,
  },
  physioView: {
    backgroundColor: PHYSIOTHERAPIST_BACKGROUND_COLOR,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    padding: 8,
  },
  dieticianView: {
    backgroundColor: DIETICIAN_BACKGROUND_COLOR,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    padding: 8,
    marginBottom: 2,
  },
  cardBorderRadius: {
    borderRadius: 3,
    elevation: 0,
  },
  paddingLeft: {
    paddingLeft: 3,
  },
  description: {
    color: CARD_SUB_TEXT_COLOR,
    fontSize: 14,
    opacity: 0.8,
  },
  itemsCenter: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalPaddingAndMarginStyles: {
    padding: 0,
    margin: 0,
  },
  modalViewStyle: {
    height: '80%',
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  saveText: {
    fontSize: 14,
    color: DEFAULT_WHITE_COLOR,
    textTransform: 'uppercase',
  },
  textAreaStyles: {
    borderRadius: 10,
  },
  uploadTextStyles: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
