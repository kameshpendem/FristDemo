import { StyleSheet, StatusBar } from "react-native";
import { hp } from "../../../../themes/Scale";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  DEFAULT_BLACK_COLOR
} from "../../../../themes/variable";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default StyleSheet.create({
  deleteIcon: {
    fontSize: 20,
    color: APP_PRIMARY_COLOR,
    fontWeight: "bold",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 15
  },
  headings: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  head: { flex: 1 },
  row: { flexDirection: "row" },
  search: {
    flex: 1,
    position: "relative"
  },
  data: {
    // flex: 1,
    position: "absolute",
    top: 120,
    zIndex: 999,
    width: "100%"
    // bottom: 80
    // height: "85%"
  },
  vaccineName: {
    padding: 15,
    marginHorizontal: 15,
    elevation: 4,
    backgroundColor: DEFAULT_WHITE_COLOR,
    color: DEFAULT_BLACK_COLOR
  },
  divide: { height: 1, backgroundColor: "#e1e8ee" },
  brandName: {
    flexDirection: "row",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
    justifyContent: "space-between"
  },
  inner: { padding: 10 },
  textinline: {
    textAlignVertical: "top",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10
  },
  back: { backgroundColor: DEFAULT_WHITE_COLOR },
  flow: {
    // flexDirection: 'row',
    alignItems: "center"
  },
  medicineview: {
    flexDirection: "row"
  },
  textside: { width: "80%" },
  medicinetext: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    paddingLeft: 5
    // fontSize: 16,
  },
  labtext: { fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR, paddingLeft: 5 },
  lab: {
    justifyContent: "space-between",
    paddingVertical: 10
  },
  gap: { height: 10, backgroundColor: "rgb(247,247,247)" },
  addbottom: {
    bottom: 10,
    position: "absolute",
    width: "100%",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 10,
    flex: 1
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 10,
    margin: 5,
    borderRadius: 5
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    fontSize: 18
  }
});
