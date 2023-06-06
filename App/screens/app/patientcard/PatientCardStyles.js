import { StyleSheet } from "react-native";
import { wp, hp } from "../../../themes/Scale";
import { theme } from "../../../themes/Theme";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  FONT_FAMILY,
  DEFAULT_BLACK_COLOR
} from "../../../themes/variable";
export default StyleSheet.create({
  input: {
    flexDirection: "row",
    marginVertical: wp(4),
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  },
  liveStatus: {
    marginLeft: wp(5),
    width: wp(50),
    borderRadius: 20,
    alignItems: "center"
  },
  image: {
    flexDirection: "row",
    margin: wp(10),
    marginBottom: wp(10)
  },
  iconsize: {
    width: 20,
    height: 20
  },
  direction: {
    flexDirection: "row"
  },
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_GREY_COLOR,
    marginTop: 10
  },
  flatImage: {
    width: wp(20),
    height: hp(20)
  },
  icon: {
    width: 10,
    height: 10
  },
  textfont: {
    fontFamily: theme.fontFamily.primaryRegular
  },
  close: {
    width: 12,
    height: 12
  },
  alignment: {
    alignSelf: "center"
  },
  textAlignment: {
    textAlign: "left",
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    width: "70%"
  },
  divide: { height: 1, backgroundColor: "#e1e8ee" },
  vertical: {
    marginVertical: wp(12),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 5,
    flexDirection: "row"
  },
  historyicon: {
    width: 18,
    height: 18,
    marginRight: 5
  },
  details: {
    marginVertical: wp(5)
  },
  horizontal: {
    marginHorizontal: wp(10),
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
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
  }
});
