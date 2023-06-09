import {StyleSheet} from 'react-native';
import {theme} from '../../../themes/Theme';
import {wp, hp} from '../../../themes/Scale';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  CARD_SUB_TEXT_COLOR,
  TEXT_INPUT_TITLE,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  PATIENT_CARD_BORDER_COLOR,
  DEFAULT_RED_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
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
  borderColor: DEFAULT_GREY_COLOR,
};

export default StyleSheet.create({
  HeaderText: {
    color: DEFAULT_WHITE_COLOR,
    marginLeft: 50,
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.xs1,
    // opacity: 0.7,
  },
  Header: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: 60,
  },
  HeaderView: {
    height: 32,
    backgroundColor: APP_PRIMARY_COLOR,
    top: -10,
  },
  View: {
    marginLeft: 16,
  },
  HeaderLeft: {
    flexDirection: 'row',
  },
  Logo: {
    marginLeft: 14,
  },
  Container: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingBottom: 30,
  },
  BasicDetailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: wp(10),
  },
  TextView: {
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.lg,
    color: CARD_SUB_TEXT_COLOR,
  },
  SubText: {
    fontSize: 16,
    top: 4,
    fontFamily: theme.fontFamily.primaryRegular,
    opacity: 0.7,
    paddingBottom: 10,
  },
  CircularView: {
    marginRight: 16,
  },
  TextInputView: {
    marginLeft: 16,
    marginRight: 16,
    //marginTop:5
  },
  qualificationdegree: {
    marginLeft: 16,
    marginRight: 16,
    //marginVertical:10
  },
  phoneinputstyle: {
    borderColor: LIST_SUB_TEXT_COLOR,
    borderBottomWidth: 0.8,
    height: 40,
    width: '93%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  OrganizationName: {
    borderColor: LIST_SUB_TEXT_COLOR,
    borderBottomWidth: 0.8,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextinputStyle: {
    height: 40,
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderColor: LIST_SUB_TEXT_COLOR,
    fontSize: 15,
    width: '100%',
  },
  ErrorText1: {
    fontSize: 10,
    fontWeight: '500',
    color: 'red',
    marginLeft: 17,
  },
  ErrorText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'red',
  },
  PhoneNumberView: {},
  Phncode: {
    flexDirection: 'row',
  },
  PhncodeView: {
    width: '10%',
    marginLeft: 5,
  },
  PhoncodeStyle: {
    marginLeft: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 10,
  },
  TextInputView1: {},
  SelectphnText: {
    fontSize: 9,
  },
  BorderLine: {
    marginLeft: -4,
    backgroundColor: LIST_SUB_TEXT_COLOR,
    height: 0.8,
  },
  PhoneNumber: {
    height: 58,
    backgroundColor: DEFAULT_WHITE_COLOR,
    fontSize: 16,
  },
  EmailValidator: {
    fontSize: 10,
    fontWeight: '500',
    color: 'red',
  },
  DateofBirthText: {
    marginLeft: 16,
    marginRight: 16,
    paddingTop: 10,
    color: '#939393',
    fontWeight: '900',
  },
  DatePicker: {
    width: '100%',
    height: wp(30),
  },
  BoderLine2: {
    backgroundColor: DEFAULT_GREY_COLOR,
    height: 1,
  },
  TermsofConditions: {
    marginTop: '25%',
    marginLeft: 16,
    marginRight: 20,
  },
  TermsofConditionsText: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm1,
  },
  UnderlineText: {
    fontFamily: 'NunitoSans-Bold',
    alignItems: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  BasicNextButton: {
    marginTop: '5%',
    marginRight: 16,
    marginLeft: 16,
  },
  BasicNextButtonView: {
    width: '98%',
    justifyContent: 'center',
    backgroundColor: APP_PRIMARY_COLOR,
  },
  ConfirmDeletionbutton: {
    width: '95%',
    // marginRight: wp(10),
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    borderRadius: 6,
  },
  CancelDeletionbutton: {
    width: '100%',
    // marginLeft: wp(10),
    backgroundColor: APP_PRIMARY_COLOR,
    elevation: 0,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontSize: 18,
    fontFamily: 'NunitoSans-SemiBold',
    color: DEFAULT_WHITE_COLOR,
  },
  ButtonText1: {
    fontSize: theme.fontSizes.ml,
    color: APP_PRIMARY_COLOR,
    lineHeight: 25,
    fontFamily: theme.fontFamily.primarySemiBold,
    textTransform: 'capitalize',
  },
  ButtonText2: {
    fontSize: theme.fontSizes.ml,
    color: DEFAULT_WHITE_COLOR,
    lineHeight: 25,
    fontFamily: theme.fontFamily.primarySemiBold,
    textTransform: 'capitalize',
  },
  Experience: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  ExperienceText: {
    marginLeft: 5,
    fontFamily: 'NunitoSans-Bold',
    fontSize: 22,
  },
  WorkExpeience: {
    top: 5,
    fontSize: 14,
    fontFamily: 'NunitoSans-Regular',
  },
  Organization: {
    marginLeft: 16,
    marginRight: 16,
  },
  ExpCheckbox: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row',
    marginTop: 15,
  },
  CurrentWork: {
    margin: wp(5),
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md1,
    color: CARD_SUB_TEXT_COLOR,
  },
  ExpdateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(15),
    width: '100%',
  },
  FormDataView: {
    justifyContent: 'flex-start',
    marginLeft: 16,
  },
  FormDataViewText: {
    marginLeft: 8,
    color: '#777777',
    fontFamily: 'NunitoSans-Regular',
  },
  TilldateView: {
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  ExpNxtButtonView: {
    marginTop: '55%',
    marginRight: 16,
    marginLeft: 16,
  },
  cancelIcon: {
    marginRight: 25,
    marginLeft: 25,
    width: wp(25),
    height: wp(25),
  },
  cancelIconView: {
    marginTop: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  OtpView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  OtpTextView: {
    marginLeft: 30,
    justifyContent: 'flex-start',
  },
  OtpText: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    marginLeft:-20,
  },
  otpSentNumber: {
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primaryBold,
    color: '#151414',
  },
  CrossView: {
    marginRight: 16,
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  OtpinputView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 50,
  },
  OtpInputs: {
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    borderRadius: 4,
    padding: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    // shadowColor: DEFAULT_WHITE_COLOR,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    elevation: 5,
    borderColor: DEFAULT_GREY_COLOR,
    fontSize: 20,
  },
  Resend: {
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 40,
  },
  OtpButtonView: {
    marginTop: 50,
    marginRight: 16,
    marginLeft: 16,
  },
  PasswordsView: {
    marginLeft: 16,
    marginRight: 16,
  },
  Passwordmust: {
    marginTop: 24,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
  CheckIcon: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 9,
  },
  PasswordText: {
    marginLeft: 18,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
    color: '#646467',
  },
  PasswordTextGreen: {
    marginLeft: 18,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
    color: '#32cd32',
  },
  CreateAccont: {
    marginTop: '65%',
    marginRight: 16,
    marginLeft: 16,
  },
  CertificateView: {
    marginLeft: 16,
    marginTop: 20,
  },
  UploadView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UploadText: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Regular',
    padding: 8,
    marginLeft: 5,
    marginRight: 16,
    marginTop: 10,
    justifyContent: 'flex-start',
  },
  CertificateIcon: {
    height: 50,
    width: 50,
    backgroundColor: '#EDF5F7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  QualificationButtonView: {
    marginTop: 45,
    bottom: 0,
    left: 0,
    marginRight: 16,
    marginLeft: 16,
    paddingBottom: 30,
  },
  SignatureCapture: {
    height: '85%',
    borderColor: '#000033',
    borderWidth: 1,
  },
  SinatureButtons: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    margin: 5,
  },
  Save: {
    fontFamily: 'NunitoSans-Bold',
    marginLeft: 20,
  },
  SignatureView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 16,
    marginTop: wp(25),
  },
  Signaturepad: {
    backgroundColor: '#F7F7F7',
    height: '45%',
    marginLeft: 16,
    marginRight: 16,
    marginTop: wp(25),
    borderRadius: wp(5),
    flexDirection: 'row',
  },
  Signhere: {
    fontFamily: theme.fontFamily.primaryRegular,
    transform: [{rotate: '270deg'}],
    textAlign: 'left',
    color: LIST_SUB_TEXT_COLOR,
  },
  signimge: {
    height: '90%',
    width: '90%',
    alignSelf: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
  },
  deleteSignView: {
    top: wp(15),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 16,
    flexDirection: 'row',
    paddingTop: wp(5),
    paddingBottom: wp(5),
  },
  deleteSign: {
    color: DEFAULT_RED_COLOR,
    fontFamily: 'NunitoSans-Regular',
  },
  Model: {
    backgroundColor: 'white',
    height: '65%',
    borderRadius: wp(15),
  },
  SignText: {
    backgroundColor: 'white',
    fontSize: 18,
  },
  SignNxtButton: {
    marginRight: 16,
    marginLeft: 16,
    marginTop: '16%',
  },
  headerImageStyles: {
    marginLeft: 14,
    width: 130,
    height: 40,
  },
  leftHeaverView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStyles: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: 60,
  },
  basicDetailsMainView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    paddingBottom: 10,
  },
  circleText: {
    fontFamily: theme.fontFamily.primaryBold,
    fontSize: theme.fontSizes.md,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  drTextInput: {
    height: wp(30),
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_GREY_COLOR,
    fontSize: theme.fontSizes.sm,
    color: DEFAULT_BLACK_COLOR,
    paddingTop: 0,
    paddingBottom: 0,
  },
  labelText: {
    fontFamily: theme.fontFamily.primaryRegular,
    color: TEXT_INPUT_TITLE,
    fontSize: theme.fontSizes.sm,
  },
  labelMarginTop: {
    marginTop: wp(15),
  },
  textInput: {
    height: wp(30),
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_GREY_COLOR,
    fontSize: theme.fontSizes.sm,
    paddingTop: 0,
    paddingBottom: 0,
  },
  marginTop15: {
    marginTop: wp(20),
  },
  dateInput: {
    borderWidth: 0,
    alignContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_GREY_COLOR,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    height: wp(30),
  },
  dateIcon: {
    display: 'none',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_GREY_COLOR,
  },
  marginTop25: {
    marginTop: wp(25),
  },
  pickerMainView: {
    height: wp(35),
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'left',
    marginLeft: wp(-7),
  },
  selectGenderPickerItem: {
    color: LIST_SUB_TEXT_COLOR,
    padding: 0,
    margin: 0,
    fontSize: theme.fontSizes.sm,
  },
  pickerItems: {
    fontSize: theme.fontSizes.sm,
  },
  checkBoxMargin: {
    marginLeft: wp(-8),
    borderRadius: 100,
  },
  flex: {
    flex: 1,
  },
  signatureMainView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: wp(-20),
  },
  signatureTouchableView: {
    flex: 1,
    marginLeft: wp(-20),
  },
  signHereComponentText: {
    fontFamily: theme.fontFamily.primaryRegular,
    transform: [{rotate: '270deg'}],
    textAlign: 'left',
    color: CARD_SUB_TEXT_COLOR,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  signButtonsView: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: PATIENT_CARD_BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingTop: wp(5),
  },
  signHereMainView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: wp(-15),
  },
  clearButtonText: {
    fontFamily: theme.fontFamily.primaryRegular,
    color: CARD_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.md1,
  },
  saveButtonText: {
    fontFamily: theme.fontFamily.primarySemiBold,
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.md1,
  },
  signatureButtonStyles: {
    width: '20%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 0,
  },
  modalStyles: {
    marginLeft: wp(8),
    marginRight: wp(8),
  },
  viewBorderRadius: {
    borderRadius: wp(10),
  },
  backgroundColorWhite: {
    backgroundColor: 'white',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  checkedIconView: {
    height: wp(20),
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  checkedIconViewRight: {
    transform: [{rotate: '45deg'}],
    height: hp(12),
    width: wp(5),
    borderBottomWidth: wp(1),
    borderBottomColor: DEFAULT_WHITE_COLOR,
    borderRightWidth: wp(1),
    borderRightColor: DEFAULT_WHITE_COLOR,
    marginTop: wp(-3),
  },
  signatureColorsMainView: {
    borderColor: '#00000029',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: wp(8),
    paddingRight: 0,
    borderRadius: 50,
    alignItems: 'center',
  },
  paddingRight7: {
    paddingRight: 7,
  },
  paddingLeft7: {
    paddingLeft: 7,
  },
  signatureText: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    fontSize: theme.fontSizes.ml,
    fontFamily: theme.fontFamily.primaryBold,
  },
  modalHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  passwordMarginTop: {
    marginTop: wp(20),
  },
  sendOtp: {
    fontSize: theme.fontSizes.md,
    justifyContent: 'center',
    textAlign: 'center',
  },
  optClickHereText: {
    textDecorationLine: 'underline',
    color: APP_PRIMARY_COLOR,
    marginLeft: wp(5),
  },
  sendOtpMainView: {
    marginTop: wp(40),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  closeModal: {
    height: '75%',
    ...modalStyles,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
  },
});
