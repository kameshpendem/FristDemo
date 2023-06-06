import { Platform, StyleSheet } from "react-native";
import {
  APP_PRIMARY_COLOR,
  APP_PRIMARY_LIGHT_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  TEXT_COLOR,
  ABOUT_TEXT,
  TEXT_V,
  FONT_FAMILY
} from "../../../themes/variable";

import { Dimensions } from "react-native";
import { wp } from "../../../themes/Scale";
import { theme } from "../../../themes/Theme";
let deviceWidth = Dimensions.get("window").width;

const callModalStyles = {
  marginTop: "auto",
  backgroundColor: DEFAULT_WHITE_COLOR,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  // padding: 25,
  paddingLeft: 30,
  paddingRight: 30,
  paddingTop: 15,
  shadowColor: DEFAULT_WHITE_COLOR,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
  borderColor: LIST_SUB_TEXT_COLOR
};

export default StyleSheet.create({
  containerView: {
    backgroundColor: APP_PRIMARY_LIGHT_COLOR
  },
  flex: {
    flex: 1
  },
  flexDirectionRow: {
    flexDirection: "row"
  },
  ProfileImage: {
    margin: 16
  },
  docDetailsView: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row"
  },
  docImageRow: {
    flexDirection: "row"
  },
  modalDocPic: {
    alignContent: "center",
    alignSelf: "center"
  },
  modalDocName: {
    marginLeft: 16,
    marginTop: 20
  },
  docName: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontFamily: "NunitoSans-SemiBold",
    marginTop: 20,
    marginLeft: 16
  },
  docMName: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontFamily: "NunitoSans-SemiBold",
    marginTop: 20
  },
  docLName: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontFamily: "NunitoSans-SemiBold",
    marginTop: 20
  },
  docSpec: {
    fontSize: 14,
    color: TEXT_COLOR,
    fontFamily: "NunitoSans-Regular",
    marginLeft: 16,
    paddingVertical: 4
  },
  viewSpec: {
    flexDirection: "column",
    marginTop: 40
  },
  DocVisitView: {
    borderColor: TEXT_V,
    backgroundColor: TEXT_V,
    margin: 3,
    borderRadius: 20,
    marginLeft: 16,
    //height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },

  DocVisitsImage: {
    width: 12,
    height: 15,
    //padding: 5,
    margin: 5
  },
  visitText: {
    fontSize: 14,
    marginHorizontal: 5,
    color: ABOUT_TEXT,
    fontFamily: "NunitoSans-Regular",
    margin: 4,
    padding: 5
  },
  modal: {
    margin: 0,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "white",
    // height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //flex: 0,
    bottom: 0,
    position: "absolute",
    width: "100%"
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  modalHeadertext: {
    paddingVertical: 5,
    marginLeft: 16,
    fontSize: 18,
    color: "#151414",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  modalHeaderSubtext: {
    paddingVertical: 5,
    marginLeft: 16,
    fontSize: 15,
    color: "#777777",
    fontFamily: "NunitoSans-Regular"
  },
  modalTextType: {
    paddingVertical: 10,
    marginLeft: 16,
    fontSize: 16,
    color: "#151414",
    fontFamily: "NunitoSans-Regular"
  },
  timeDayText: {
    fontSize: 18,
    color: "#151414",
    fontFamily: "NunitoSans-Regular",
    marginLeft: 4
  },
  timeDayView: {
    flexDirection: "row",
    marginLeft: 16,
    alignItems: "center"
  },
  timeDayImage: {
    width: 22,
    height: 22
  },
  buttonContainer: {
    // flex: 1,
    backgroundColor: "white",
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 7,
    marginVertical: 7,
    paddingHorizontal: 3,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    //marginHorizontal: 5,
    alignItems: "center"
  },
  buttonText: {
    textAlign: "center",
    color: "#151414",
    //fontWeight: '700',
    fontSize: 12,
    fontFamily: "NunitoSans-Regular",
    marginHorizontal: 5
  },
  flatlistView: {
    //marginHorizontal: 16,
  },
  slotViewFlatlist: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 5
  },
  clockImage: { width: 12, height: 12, marginHorizontal: 2 },
  modal1: {
    margin: 0,
    backgroundColor: "white",
    //height: '30%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //flex: 0,
    bottom: 0,
    position: "absolute",
    width: "100%",
    //justifyContent: 'center',
    //alignItems: 'center',
    height: "80%"
  },
  modalHeaderText1: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontFamily: "NunitoSans-SemiBold",
    marginVertical: 5
  },
  modalHeaderSubText1: {
    // color: LIST_SUB_TEXT_COLOR,
    fontSize: 13,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    marginVertical: 5
  },
  modalSubText1: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 16,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    marginVertical: 5
  },
  textModalone: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 16,
    fontFamily: "NunitoSans-Regular",
    marginVertical: 5
  },
  branchicon1: {
    width: 14,
    height: 14
  },
  bottomView: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  },
  iconStyle: {
    fontSize: 30
  },
  icon: {
    width: 15,
    height: 15,
    alignItems: "center",
    marginLeft: 5
  },
  icon1: {
    width: 25,
    height: 25,
    alignItems: "center"
    // marginLeft: 5,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0
  },
  bottomViewStyles: {
    // position: 'absolute',
    bottom: 0,
    // marginTop: Platform.OS === "ios" ? 150 : 150,
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    paddingBottom: 5
  },
  loginStyles: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 6,
    height: 50,
    bottom: 20,
    backgroundColor: APP_PRIMARY_COLOR,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
    elevation: 0
  },
  loginButtonText: {
    fontSize: 14,
    color: DEFAULT_WHITE_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    letterSpacing: 0.5
  },
  loginModal: {
    // height: Platform.OS === "ios" ? "60%" : "70%",
    ...callModalStyles,
    // padding: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20
  },
  inputSectionMainView: {
    marginTop: 10,
    marginBottom: 30
  },
  complaintsTextInput: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRadius: wp(6),
    padding: wp(10)
  },
  input: {
    flexDirection: "row",
    marginHorizontal: wp(10),
    marginVertical: wp(5)
  },
  textfont: {
    fontFamily: theme.fontFamily.primaryRegular
  },
  left: {
    marginLeft: 5
  },
  dropdown4BtnStyle: {
    width: "auto",
    height: "auto",
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#444",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  dropdown4BtnTxtStyle: { textAlign: "left", fontSize: 12 },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF", fontSize: 12 },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 }
});
