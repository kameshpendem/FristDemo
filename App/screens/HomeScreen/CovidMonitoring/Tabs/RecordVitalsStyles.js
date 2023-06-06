import {StyleSheet} from 'react-native';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_RED_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_DIGIT_TEXT_COLOR,
} from '../../../../themes/variable';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  inputSectionMainView: {
    flex: 1,
  },
  inputSectionView: {
    flex: 1,
    flexDirection: 'row',
  },
  inputText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
  },
  horizontalLine: {
    borderBottomColor: DEFAULT_GREY_COLOR,
    borderBottomWidth: 1,
    marginTop: 5,
    flex: 1,
    opacity: 0.3,
  },
  vitalRecordInputSection: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  checkBoxMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  textSectionMainView: {
    flex: 1,
    margin: 5,
    // marginLeft: 3,
    // marginRight: 0,
    padding: 3,
    paddingLeft: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  textView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  textFontAndColor: {
    fontSize: 9.2,
    color: DEFAULT_RED_COLOR,
  },
  leftHeaderTextAndColor: {
    fontSize: 12,
    color: DEFAULT_RED_COLOR,
  },
  footerTotalSection: {
    borderColor: DEFAULT_GREY_COLOR,
    backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
    borderTopColor: DEFAULT_GREY_COLOR,
  },
  footerView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  dateComponentStyles: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  asOfText: {
    fontSize: 12,
    paddingRight: 10,
  },
  dateImageComponentStyles: {
    height: 12,
    width: 12,
    paddingRight: 10,
  },
  extraRecordingVitalMainView: {
    flex: 1,
    marginTop: 5,
  },
  textInfoView: {
    flex: 1,
  },
  recordText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordButtonMainView: {
    flex: 1,
    display: 'flex',
    marginTop: 5,
    marginBottom: 25,
    marginLeft: '25%',
  },
  nativeButton: {
    display: 'flex',
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  startText: {
    fontSize: 14,
    color: DEFAULT_WHITE_COLOR,
  },
  modalView: {
    backgroundColor: 'white',
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
  halfModalStyles: {
    height: '70%',
    marginTop: 'auto',
    backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  modalCloseView: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  closeIconStyles: {
    height: 20,
    width: 20,
  },
  additionalRecordVitalView: {
    flexDirection: 'row',
    marginTop: 12,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  recordVitalSaveButton: {
    display: 'flex',
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  recordVitalButtonMainView: {
    marginTop: 20,
    marginLeft: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  digitStyle: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    fontSize: 12,
  },
  digitTxtStyle: {
    color: DEFAULT_DIGIT_TEXT_COLOR,
  },
  doctorInstructionsMainView: {
    marginBottom: 15,
    marginTop: 15,
  },
  doctorSectionMainView: {
    marginTop: 5,
    flexDirection: 'row',
  },
  timeText: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
  doctorInstructionsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  instText: {
    fontSize: 14,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
  },
  // dateIcon: {
  //   height: 10,
  //   width: 10,
  //   marginLeft: 0,
  //   fontSize: 2,
  // },
  dateInput: {
    height: 15,
    borderColor: 'transparent',
  },
  dateText: {
    fontSize: 12,
  },
  text: {
    fontSize: 14,
  },
  marginTop15: {
    marginTop: 15,
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 18,
    paddingLeft: 10,
  },
  inputMain: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  marginTop45: {
    marginTop: 45,
  },
  patientClosedTextStyles: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
