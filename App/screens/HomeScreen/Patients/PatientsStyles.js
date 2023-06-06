import {StyleSheet} from 'react-native';
// color variables
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  PATIENT_CARD_BORDER_COLOR,
  PATIENT_CARD_BUTTON_SECTION_COLOR,
  CLOSE_STATUS_COLOR,
  STATUS_TEXT_COLOR,
  STATUS_BACKGROUND_COLOR,
  PATIENT_CARD_BUTTON_TEXT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  APP_TERTIARY_COLOR,
  DEFAULT_RED_COLOR,
} from '../../../themes/variable';
import { wp, hp } from "../../../themes/Scale";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  input: {
    marginTop: 15,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderWidth: 1,
    height: 40,
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  autocompleteContainer: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    width: '100%',
  },
  autoInputContainerStyles: {
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
  },
  containerStyles: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    shadowOffset: {
      width: 0,
      height: 6,
    },
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 5,
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 8,
  },
  eventBox: {
    flex: 1,
    margin: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  eventDate: {
    flexDirection: 'column',
  },
  eventDay: {
    fontSize: 26,
    color: APP_PRIMARY_COLOR,
    fontWeight: '600',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  patientsMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 14,
    color: LIST_SUB_TEXT_COLOR,
  },
  detailsCardView: {
    borderWidth: 1,
    borderColor: PATIENT_CARD_BORDER_COLOR,
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 6,
    marginTop: 10,
  },
  nameStatusView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: 0,
  },
  itemsRightEnd: {
    alignItems: 'flex-end',
  },
  buttonsSectionView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: PATIENT_CARD_BUTTON_SECTION_COLOR,
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonStyles: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: PATIENT_CARD_BUTTON_SECTION_COLOR,
    elevation: 0,
    flexDirection: 'row',
  },
  nameStyles: {
    color: DEFAULT_BLACK_COLOR,
    fontWeight: 'bold',
    fontSize: 15,
  },
  statusStyles: {
    fontSize: 12,
    padding: 4,
    borderRadius: 2,
  },
  closeStatusStyles: {
    backgroundColor: CLOSE_STATUS_COLOR,
    color: DEFAULT_BLACK_COLOR,
  },
  remainingStatusStyles: {
    backgroundColor: STATUS_BACKGROUND_COLOR,
    color: STATUS_TEXT_COLOR,
  },
  idView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: 8,
    paddingTop: 5,
  },
  buttonText: {
    fontSize: 12,
    color: PATIENT_CARD_BUTTON_TEXT_COLOR,
    paddingLeft: 3,
  },
  idTextStyles: {
    fontSize: 13,
    color: LIST_SUB_TEXT_COLOR,
  },
  autoSearchTouchableView: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginTop: 10,
    borderRadius: 6,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: LIST_SUB_TEXT_COLOR,
  },
  subText: {
    color: DEFAULT_BLACK_COLOR,
  },
  autoSearchViewPadding: {
    padding: 6,
  },
  confirmModalCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewMarginTop: {
    marginTop: 15,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  callPatientView: {
    flexDirection: 'row',
    marginRight: 20,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textTransform: {
    textTransform: 'capitalize',
  },
  itemsCenter: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  flexDirection: {
    flexDirection: 'row',
  },
  phoneNumberStyles: {
    fontSize: 21,
    color: APP_TERTIARY_COLOR,
    textDecorationLine: 'underline',
  },
  errorMessageStyles: {
    fontSize: 12,
    color: DEFAULT_RED_COLOR,
  },
  popUpButtonStyles: {
    backgroundColor: APP_PRIMARY_COLOR,
    justifyContent: 'center',
    height: 30,
    width: 70,
    marginLeft: 10,
  },
  popUpTextColor: {
    fontSize: 12,
    color: DEFAULT_WHITE_COLOR,
    alignItems: 'center',
  },
  listContainerStyles: {
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  listStyles: {
    marginBottom: 0,
    borderWidth: 0,
    marginLeft: 10,
    marginRight: 10,
    zIndex:1,
    position: 'relative'
  },
  id: {
    color: LIST_SUB_TEXT_COLOR,
    fontWeight: '800',
    fontSize: 12,
  },
  itemsEnd: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  back_button: {
    tintColor: DEFAULT_WHITE_COLOR,
    position: "relative",
    left: 12,
    height: hp(25),
    width: wp(25),
    marginRight: 10
  }
});
