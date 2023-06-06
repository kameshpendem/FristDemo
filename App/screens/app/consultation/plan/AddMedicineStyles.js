import { StyleSheet, StatusBar, Dimensions, Platform } from "react-native";
import { wp, hp } from "../../../../themes/Scale";
import {
  DEFAULT_GREY_COLOR,
  FONT_FAMILY,
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_BLACK_COLOR
} from "../../../../themes/variable";
const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const styles = StyleSheet.create({
  flex_1: {
    flex: 1,
    paddingBottom: hp(80)
  },
  header: {
    backgroundColor: APP_PRIMARY_COLOR,
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp(70),
    padding: 15
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  headings: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
  },
  textcolor: { color: DEFAULT_GREY_COLOR },
  top: { marginTop: 10 },
  row: { flexDirection: "row" },
  gap: { height: 10, backgroundColor: "rgb(247,247,247)" },
  scroll: {
    flex: 1,
    flexGrow: 2,
    paddingBottom: 50
  },
  fulllength: { flex: 0.8 },
  flexes: {
    flexDirection: "row",
    //flex: 4,
    marginVertical: 10
    // justifyContent: "space-evenly"
  },
  flexes1: {
    flexDirection: "row",
    flex: 5,
    marginVertical: 10
  },
  countries: { marginLeft: 10, width: wp(100) },
  vertical: { marginVertical: 10 },
  quantity: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 10
    //backgroundColor: "red"
  },
  quantity1: {
    flex: 2,
    borderRadius: 10,
    flexDirection: "row"
  },
  screentop: { marginTop: 5 },
  howmuch: {
    padding: 15,
    //flex: 1,
    backgroundColor: DEFAULT_WHITE_COLOR
  },
  divide: { height: 1, backgroundColor: "#e1e8ee" },
  date: {
    marginRight: 10,
    marginLeft: 5,
    textAlign: "center",
    alignSelf: "center",
    color: DEFAULT_GREY_COLOR
  },
  tablet: {
    flexDirection: "row",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
    justifyContent: "space-between"
  },
  note: {
    height: "25%",
    // textAlignVertical: 'top',
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10
  },
  sos: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 5,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  smalltext: { fontSize: 12, fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR },
  check: { flexDirection: "row", marginBottom: 5 },
  dataTime: { marginVertical: 10, marginLeft: 20 },
  dates: {
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
    flexDirection: "row",
    marginTop: 5,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "center"
  },
  medicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  time: {
    marginLeft: 5,
    flexDirection: "row",
    flexWrap: "wrap"
    //alignSelf: "center"
  },
  timing: {
    width: "auto",
    height: "auto",
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
    margin: 2,
    flexDirection: "row",
    fontSize: 16
    // alignSelf: "center"
  },
  custom: {
    padding: Platform.OS === "ios" ? 6 : Platform.OS === "android" ? 0 : 0
    //textAlign: 'center',
    // height: '10%',
  },
  flexborder: {
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    flexDirection: "row",
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center"
    // height: hp(40),
  },
  flexText: {
    borderRightWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightColor: DEFAULT_GREY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "rgb(247,247,247)"
  },
  flexText1: {
    borderRightWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: "center",
    backgroundColor: APP_PRIMARY_COLOR
  },
  empty: {
    borderRightColor: DEFAULT_GREY_COLOR,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "rgb(247,247,247)"
  },
  flexcustom: {
    width: "auto",
    height: "auto",
    borderWidth: 1,
    padding: 10,
    borderColor: "#000",
    marginTop: 10
  },
  deleteIcon: {
    fontSize: 20,
    color: APP_PRIMARY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 15
  },
  crossimage: {
    tintColor: DEFAULT_WHITE_COLOR
  },
  crossimage1: {
    tintColor: DEFAULT_WHITE_COLOR,
    marginRight: wp(55)
  },
  searchmedicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    color: DEFAULT_GREY_COLOR,
    width: "100%"
  },
  addtext: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 18,
    paddingTop: 5,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  content: {
    flex: 1,
    position: "relative"
  },
  searchoutside: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 5
  },
  search: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    margin: 10
  },
  medName: {
    padding: 15,
    marginHorizontal: 15,
    elevation: 4,
    backgroundColor: DEFAULT_WHITE_COLOR,
    color: DEFAULT_BLACK_COLOR
  },
  searchimg: {
    height: hp(25),
    width: wp(25),
    margin: 10
  },
  addbottom: {
    bottom: 10,
    position: "absolute",
    width: "100%",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 10,
    borderRadius: 5
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    fontSize: 18
  },
  ///
  dropdown4BtnStyle: {
    width: "auto",
    height: "auto",
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#444",
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  dropdown4BtnTxtStyle: { textAlign: "left", fontSize: 12 },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF", fontSize: 12 },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  radioView: { alignSelf: "center", marginRight: 5 },
  fs_16: {
    fontSize: 16
  },
  clockIcon: { fontSize: 22, alignSelf: "center" },
  mt5: {
    marginTop: 5
  },
  inlineSwitchContainer: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center"
  },
  inlineSwitchText: {
    fontSize: 18,
    marginRight: 8
  }
});
