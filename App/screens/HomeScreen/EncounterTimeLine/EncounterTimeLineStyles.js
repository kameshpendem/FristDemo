import {StyleSheet} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  LIST_SUB_TEXT_COLOR,
  PATIENT_CARD_BORDER_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_BLACK_COLOR,
  CLOSE_STATUS_COLOR,
  PATIENT_CARD_BUTTON_SECTION_COLOR,
  PATIENT_CARD_BUTTON_TEXT_COLOR,
  STATUS_BACKGROUND_COLOR,
  STATUS_TEXT_COLOR,
} from '../../../themes/variable';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
  },
  eventList: {
    marginTop: 8,
  },
  eventDate: {
    flexDirection: 'column',
  },
  eventDay: {
    fontSize: 30,
    color: APP_PRIMARY_COLOR,
    fontWeight: '600',
  },
  eventMonth: {
    fontSize: 26,
    color: '#345D7E',
    fontWeight: '600',
  },
  eventYear: {
    fontSize: 18,
    color: '#4F575C',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  docPhoto: {
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: '#dcdcdc',
    margin: 2,
  },
  description: {
    fontSize: 14,
  },
  doctorName: {
    fontSize: 18,
    color: '#345D7E',
    fontWeight: '500',
  },
  encID: {
    fontSize: 14,
    color: '#2D323C',
  },
  card: {
    shadowColor: '#00000021',

    shadowOffset: {
      width: 0,

      height: 6,
    },

    marginHorizontal: 10,

    marginVertical: 5,

    shadowOpacity: 0.37,

    shadowRadius: 7.49,

    elevation: 5,

    backgroundColor: 'white',

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
  nameStyles: {
    color: DEFAULT_BLACK_COLOR,
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemsRightEnd: {
    alignItems: 'flex-end',
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

  idView: {
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    padding: 8,
    paddingBottom: 8,
    paddingTop: 0,
  },
  idTextStyles: {
    fontSize: 13,
    color: LIST_SUB_TEXT_COLOR,
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
  buttonText: {
    fontSize: 12,
    color: PATIENT_CARD_BUTTON_TEXT_COLOR,
    paddingLeft: 3,
  },
  remainingStatusStyles: {
    backgroundColor: STATUS_BACKGROUND_COLOR,
    color: STATUS_TEXT_COLOR,
  },
});
