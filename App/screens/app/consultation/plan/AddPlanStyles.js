import { StyleSheet, StatusBar, Platform } from "react-native";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  PATIENT_CARD_BORDER_COLOR
} from "../../../../themes/variable";
import { wp } from "../../../../themes/Scale";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default StyleSheet.create({
  SubmitButtonStyle: {
    marginVertical: 10,
    paddingVertical: 10,
    marginHorizontal: 15,
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR
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
  },
  plan: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: "center"
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DEFAULT_BACKGROUND_COLOR,
    marginHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: DEFAULT_WHITE_COLOR
  },
  TextStyle: {
    color: APP_PRIMARY_COLOR,
    textAlign: "center",
    fontSize: 18,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
  },
  Attachment: {
    marginVertical: 10,
    paddingVertical: 10,
    marginHorizontal: 15,
    backgroundColor: DEFAULT_LIGHT_GREEN_COLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 0,
    flexDirection: "row",
    justifyContent: "center"
  },

  AttachmentTextStyle: {
    color: DEFAULT_GREEN_COLOR,
    textAlign: "center",
    fontSize: 18,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
  },
  preview: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    margin: 5,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR
  },
  previewtext: {
    color: APP_PRIMARY_COLOR,
    textAlign: "center"
  },
  generate: {
    flex: 1,
    backgroundColor: "#04A6D6",
    margin: 5,
    padding: 15,
    borderRadius: 5
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center"
  },
  med: {
    width: wp(25),
    height: wp(25),
    alignSelf: "center"
  },
  row: {
    backgroundColor: DEFAULT_LIGHT_BLUE_COLOR,
    flexDirection: "row",
    textAlign: "center",
    color: "#000000",
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    textAlignVertical: "center"
    //alignContent: 'center',
  },
  flex: { flex: 1 },
  //grow: {flexGrow: 2},
  medical: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    width: "100%"
  },
  bottom: { marginVertical: 10 },
  click: {
    paddingVertical: 10,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  treatment: { fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR },
  round: { margin: 10 },
  inner: { padding: 10 },
  vertical: { marginVertical: 10 },
  view: { height: 10, backgroundColor: PATIENT_CARD_BORDER_COLOR },
  monitor: { fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD },
  backside: { backgroundColor: DEFAULT_WHITE_COLOR },
  divide: { height: 1, backgroundColor: "#e1e8ee" },
  iconsave: {
    fontSize: 22,
    color: DEFAULT_GREEN_COLOR,
    paddingHorizontal: 5
  },
  medicine: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  font: { fontSize: 16 },
  medicinetext: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 5

    // fontSize: 16,
  },
  labtext: { fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR, paddingLeft: 5 },
  lab: {
    justifyContent: "space-between"
  },
  textside: { width: "80%" },
  medicineview: {
    flexDirection: "row",
    padding: 10
  },
  deleteIcon: {
    fontSize: 22,
    color: APP_PRIMARY_COLOR,
    fontWeight: "bold",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    right: 10,
    paddingLeft: 30,
    top: 12
  },
  flow: {
    flexDirection: "row"
    //alignItems: "center"
  },
  soft: {
    alignItems: "center",
    backgroundColor: "#FEEEF0",
    paddingHorizontal: 10,
    borderTopColor: "red",
    borderWidth: 1
  },
  follow: {
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    padding: Platform.OS === "ios" ? 12 : 10,
    marginVertical: 5,
    height: Platform.OS === "ios" ? 40 : 50
  },
  attach: {
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 10,
    position: "relative",
    right: 10,
    padding: 5,
    alignItems: "center",
    top: -8
  },
  attach1: {
    width: 10,
    height: 10
  },
  att: { flexDirection: "row" },
  att1: { width: 50, height: 50 },
  wrap: { flexDirection: "row", flexWrap: "wrap", margin: 15 }
});
