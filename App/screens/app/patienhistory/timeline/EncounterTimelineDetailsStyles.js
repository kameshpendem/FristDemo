import {StyleSheet, Dimensions} from 'react-native';
import {wp} from '../../../../themes/Scale';
import {theme} from '../../../../themes/Theme';
import {
  APP_PRIMARY_COLOR,
  CARD_SUB_TEXT_COLOR,
  COLOR_CODES,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  ENCOUNTER_STATUS_BG_COLOR,
  ENCOUNTER_STATUS_TEXT_COLOR,
  HEADER_TEXT_COLOR,
  LIST_SUB_TEXT_COLOR,
  RECORDS_BACKGROUND_COLOR,
  RECORD_CARD_BACKGROUND,
  SUB_HEADER_TEXT,
} from '../../../../themes/variable';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
  },
  eventList: {
    marginTop: 8,
  },
  eventBox: {
    padding: 10,
    flexDirection: 'row',
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
  doctorNameText: {
    fontSize: 18,
    color: APP_PRIMARY_COLOR,
    fontWeight: '400',
  },
  iconTextView: {flexDirection: 'row', alignItems: 'center', marginVertical: 8},

  labOrderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labOrderIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  typeSchoolRecord: {
    marginTop: wp(5),
    marginBottom: wp(5),
  },
  dateContentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  encounterDate: {
    textAlign: 'center',
    fontSize: 15,
    color: LIST_SUB_TEXT_COLOR,
  },
  recordCard: {
    borderRadius: wp(8),
    borderWidth: 0,
    backgroundColor: RECORD_CARD_BACKGROUND,
  },
  recordsCardMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: wp(10),
  },
  recordDoctorName: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  doctorSpecialization: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  branchView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(10),
  },
  branchNameText: {
    fontSize: theme.fontSizes.sm,
    color: CARD_SUB_TEXT_COLOR,
    fontFamily: theme.fontFamily.primaryRegular,
    marginLeft: wp(5),
  },
  encID: {
    fontSize: 14,
    color: '#2D323C',
  },
  patientType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
    marginLeft: wp(5),
  },
  reminderView: {
    flexDirection: 'row',
    borderWidth: 0,
    height: wp(23),
    alignItems: 'center',
  },
  card: {
    height: wp(23),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: ENCOUNTER_STATUS_BG_COLOR,
    borderColor: ENCOUNTER_STATUS_BG_COLOR,
    elevation: 0,
    padding: wp(5),
  },
  encounterStatusText: {
    fontSize: theme.fontSizes.xs,
    margin: wp(5),
    color: ENCOUNTER_STATUS_TEXT_COLOR,
  },
  recordsMargin: {
    marginLeft: wp(15),
    marginRight: wp(15),
    marginTop: wp(10),
  },
  chiefComplaintsTextHeader: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
    color: SUB_HEADER_TEXT,
  },
  chiefComplaintsValue: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.md,
    color: DEFAULT_BLACK_COLOR,
    marginTop: wp(3),
  },
  chiefComplaintsMainView: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRadius: wp(8),
  },
  chiefComplaintsMargin: {
    margin: wp(10),
  },
  reportTextValueMargin: {
    marginTop: wp(10),
  },
  addedImage: {
    height: wp(15),
    width: wp(15),
  },
  labReportsMainView: {
    borderWidth: 1,
    borderRadius: wp(8),
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginTop: wp(10),
    marginBottom: wp(10),
  },
  labReportContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptMargin: {
    marginTop: wp(8),
  },
  receiptsMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewPdf: {
    flexDirection: 'row',
    backgroundColor: '#CBF3FF',
    borderRadius: wp(6),
    padding: wp(3),
    paddingLeft: wp(5),
    paddingRight: wp(5),
    alignItems: 'center',
  },
  viewText: {
    marginLeft: wp(2),
    color: APP_PRIMARY_COLOR,
    fontSize: theme.fontSizes.xs,
  },
  receiptNameTextMargin: {
    marginTop: wp(4),
  },
  flexDirection: {
    flexDirection: 'row',
  },
  header: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily.primaryRegular,
  },
  value: {
    fontFamily: theme.fontFamily.primaryRegular,
    fontSize: theme.fontSizes.sm,
    color: DEFAULT_GREY_COLOR,
  },
  hajTypeReportView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hajMainView: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    margin: wp(15),
    borderRadius: wp(6),
    padding: wp(10),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
