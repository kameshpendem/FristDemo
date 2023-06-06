import {StyleSheet} from 'react-native';

import {
  DEFAULT_BLACK_COLOR,
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  GUIDELINE_BACKGROUND_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
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
    paddingTop: 0,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  hospitalInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  doctorInfoView: {
    margin: 10,
  },
  doctorName: {
    flex: 4,
  },
  dateSelect: {
    flex: 2,
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 18,
  },
  picker: {
    margin: 0,
  },
  datePicker: {
    margin: 5,
  },
  textColorBlack: {
    color: DEFAULT_BLACK_COLOR,
  },
  countsView: {
    marginTop: 10,
    marginBottom: 100,
  },
  eachCountView: {
    flex: 3,
    margin: 8,
    padding: 8,
    paddingRight: 0,
    paddingBottom: 0,
    borderRadius: 10,
  },
  countLabel: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  countValue: {
    // marginTop: 30,
    marginTop: 10,
    marginBottom: 10,
    // paddingTop:10,
    color: DEFAULT_WHITE_COLOR,
    fontSize: 28,
    fontWeight: 'bold',
  },
  guidelinesView: {
    margin: 10,
    alignItems: 'center',
  },
  guidelinesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: APP_PRIMARY_COLOR,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
  modalStyles: {
    height: '60%',
    ...modalStyles,
  },
  headerView: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
  closeImage: {
    height: 18,
    width: 18,
  },
  infoTextView: {
    marginTop: 10,
    marginBottom: 10,
    // marginLeft: 3,
  },
  infoText: {
    fontSize: 14,
  },
  textInputStyles: {
    height: 40,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    borderRadius: 6,
  },
  doctorViewStyles: {
    marginTop: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  flexDirection: {
    flexDirection: 'row',
  },
  dropDownView: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  dropDownArrow: {
    height: 20,
    width: 20,
  },
  flex: {
    flex: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
  imageStyles: {
    height: 40,
    width: 40,
  },
  guideLinesMainView: {
    backgroundColor: GUIDELINE_BACKGROUND_COLOR,
    padding: 12,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 6,
    flexDirection: 'row',
  },
  guideLinesTextView: {
    flex: 1,
    width: '70%',
  },
  guideLinesText: {
    fontSize: 14,
  },
  guideLineTouchableView: {
    marginTop: 10,
    backgroundColor: '#1E917F',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  guideLineImage: {
    height: 12,
    width: 12,
  },
  guideText: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 12,
    paddingLeft: 4,
  },
  guideLineImageView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  familyImageStyles: {
    height: 100,
    width: 120,
  },
  doctorDropDownSectionView: {
    flexDirection: 'row',
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  doctorSectionTouchableView: {
    flex: 1,
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
    borderBottomWidth: 2,
    flexDirection: 'row',
    shadowColor: DEFAULT_SHADOW_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  doctorNameView: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    flex: 1,
  },
  filledDropDownView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
  datePickerSection: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
  },
  changeDateTouchableView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  changeText: {
    fontSize: 12,
    color: APP_PRIMARY_COLOR,
  },
  dateIconStyles: {
    height: 20,
    width: 20,
  },
  touchableArea: {
    height: 20,
    width: 30,
  },
});
