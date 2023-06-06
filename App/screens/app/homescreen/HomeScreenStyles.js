import { StyleSheet } from "react-native";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  FONT_FAMILY,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_BLACK_COLOR
} from "../../../themes/variable";
import { wp, hp, lh } from "../../../themes/Scale";
import { theme } from "../../../themes/Theme";
import { fontFactor } from "../../../utils/DeviceUtils";

export default StyleSheet.create({
  searchoutside: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 5
  },
  search: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: DEFAULT_BLACK_COLOR,
    borderRadius: 5,
    margin: 8
  },
  searchimg: {
    height: hp(25),
    width: wp(25),
    margin: 10
  },
  searchmedicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    width: "100%"
  },
  codeFieldRoot: {
    marginTop: 30,
    width: "100%"
  },
  cellRoot: {
    width: 50,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center"
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2
  },
  preview: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    flexDirection: "row"
  },
  previewtext: {
    color: APP_PRIMARY_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  generate: {
    flex: 1,
    backgroundColor: APP_PRIMARY_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row"
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  att1: { width: 50, height: 50 },
  attach1: {
    width: 10,
    height: 10
  },
  attach: {
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 6,
    position: "relative",
    padding: 5,
    alignItems: "center",
    right: 20,
    top: 10
  },
  loaderView: {
    flex: 1,
    marginVertical: wp(200),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  },
  dropOpacity: {
    width: 30,
    height: 30,
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 20,
    position: "relative",
    top: -12,
    alignSelf: "center",
    zIndex: 99,
    // textAlign: 'center',
    // alignContent: 'center',

    margin: 0
  },
  dropArrow: {
    height: hp(22),
    width: wp(22),
    alignSelf: "center",
    marginTop: hp(1)
  },
  upArrow: {
    transform: [{ rotate: "90deg" }]
  },
  downArrow: {
    transform: [{ rotate: "-90deg" }],
    marginTop: hp(6)
  },
  dateView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    alignItems: "center"
  },
  datePick: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: "row",
    height: hp(40)
  },
  arrowRight: {
    transform: [{ rotate: "-180deg" }]
  },
  flatImage: {
    width: wp(18),
    height: hp(18),
    marginTop: hp(10),
    //marginLeft: -5,
    marginRight: 5
    // alignSelf: 'center',
    // resizeMode: 'center',
  },
  flatView: {
    width: wp(115),
    margin: wp(3),
    height: hp(50),
    borderRadius: wp(5)
    //paddingBottom: hp(5),
    // marginTop: 15,
  },
  alignSelf: {
    alignSelf: "center"
  },
  dateCenter: {
    height: hp(40),
    width: wp(40),
    borderRadius: wp(20),
    paddingTop: hp(10)
    // marginTop: hp(2),
  },
  selected: {
    backgroundColor: APP_PRIMARY_COLOR
  },
  textcolor: {
    color: "white"
  },
  unselected: {
    backgroundColor: "#E6EEF1"
  },
  statusSelected: {
    borderWidth: 2,
    borderColor: APP_PRIMARY_COLOR
  },
  dayscolor: {
    color: "#989899"
  },
  appointmentView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    //shadowColor: '#000',
    // shadowOffset: {width: 2, height: 2},
    //shadowOpacity: 1,
    // shadowRadius: 2,
    elevation: 2,
    // flexDirection: 'row',
    // height: hp(80),
    // flexGrow: 2,
    paddingVertical: hp(5),
    paddingBottom: hp(10),
    paddingHorizontal: wp(3),
    paddingTop: -5
  },
  appointmentViewQrcode: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderWidth:3,
    borderColor:APP_PRIMARY_COLOR,
    //shadowColor: '#000',
    // shadowOffset: {width: 2, height: 2},
    //shadowOpacity: 1,
    // shadowRadius: 2,
    elevation: 2,
    // flexDirection: 'row',
    // height: hp(80),
    // flexGrow: 2,
    paddingVertical: hp(5),
    paddingBottom: hp(10),
    paddingHorizontal: wp(3),
    paddingTop: -5
  },
  statusText: {
    left: wp(5),
    top: hp(3),
    //fontFamily: theme.fontFamily.primaryRegular,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
    height: hp(450)
  },
  closeModal: {
    height: "50%",
    ...modalStyles
  },
  headerView: {
    flexDirection: "row",
    height: hp(50),
    paddingTop: 15
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 5,
    marginLeft: hp(10)
  },
  // headerText1: {

  // },
  closeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    alignContent: "center"
  },
  touchableArea: {
    height: 20,
    width: 30
  },
  closeImage: {
    height: 18,
    width: 18,
    right: Platform.OS=='ios'? 20 : 0,
    //backgroundColor: "red",
    marginLeft: 25
  },
  hr: {
    borderBottomColor: "#DAE5E6",
    borderBottomWidth: 1
  },
  appointmentStatus: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    width: wp(100),
    position: "absolute",
    top: 0,
    paddingTop: 0,
    paddingBottom: 0,
    // height: hp(30),
    right: 10
  },
  appointmentType: {
    marginLeft: wp(32),
    lineHeight: lh(25),
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  textCenter: {
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    paddingHorizontal: 5
  },
  textFont: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  liveStatus: {
    marginLeft: wp(5),
    // width: wp(50),
    borderRadius: 20,
    alignItems: "center"
    // fontSize:
  },
  appointmentName: {
    marginLeft: wp(32),
    fontFamily: theme.fontFamily.secondaryRegular,
    top: hp(5),
    // width: wp(200),
    lineHeight: lh(25),
    flexDirection: "row",
    // height: hp(25),
    alignItems: "center"
  },
  appointmentTime: {
    alignSelf: "center",
    marginLeft: 5,
    textAlign: "right",
    width: 45,
    // fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    marginTop: 5
  },
  collapseDates: {
    height: "100%",
    marginHorizontal: wp(5),
    width: wp(45),
    alignItems: "center"
  },
  statusCountView: {
    justifyContent: "flex-end"
  },
  statusCountText: {
    fontSize: 18,
    fontFamily: theme.fontFamily.secondaryRegular,
    right: 10
  },
  input: {
    flexDirection: "row",
    marginVertical: wp(8),
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  textfont: {
    fontFamily: theme.fontFamily.primaryRegular
  },
  historyicon: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  vertical: {
    marginVertical: wp(4),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 5,
    flex: 1,
    flexDirection: "row",
    padding: 0
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 12,
    borderRadius: 5,
    marginVertical: 10
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: "NunitoSans-Bold",
    fontSize: 18
  },
  //
  dropdown4BtnStyle: {
    width: "100%",
    height: "auto",
    backgroundColor: "#FFF"
  },
  dropdown4BtnStyle1: {
    width: "25%",
    height: "auto",
    backgroundColor: "#FFF",
    marginRight: -10
  },
  dropdown4BtnTxtStyle1: { textAlign: "left", fontSize: 14 },
  dropdown4BtnTxtStyle: { textAlign: "left", marginLeft: 20, fontSize: 14 },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left" },
  //
  bottomtab: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: DEFAULT_WHITE_COLOR,
    bottom: Platform.OS == "ios" ? 20 : 0,
    paddingHorizontal: 10,
    // marginBottom: -280
  },
  preview: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    flexDirection: "row"
  },
  previewtext: {
    color: APP_PRIMARY_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  generate: {
    flex: 1,
    backgroundColor: APP_PRIMARY_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row"
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  generate1: {
    backgroundColor: APP_PRIMARY_COLOR,
    margin: 5,
    padding: 12,
    borderRadius: 5
  },
  generatetext1: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  }
});
//

const modalStyles = {
  marginTop: "auto",
  backgroundColor: "red",
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  padding: 20,
  shadowColor: DEFAULT_WHITE_COLOR,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
  borderColor: DEFAULT_GREY_COLOR
};
