import { getDeviceSpecsForTheme, fontFactor } from "../utils/DeviceUtils";
import {
  DEFAULT_SHADOW_COLOR,
  STATUS_BOOKED,
  STATUS_CANCELLED,
  STATUS_CLOSED,
  STATUS_COMPLETED,
  STATUS_IN_PROCESS,
  STATUS_OFFLINE,
  STATUS_ONLINE,
  STATUS_RECONSULTING,
  STATUS_RESCHEDULED,
  STATUS_TRIAGE
} from "./variable";
class AppColors {
  static LIGHT = {
    primary: "#E3FFEE",
    secondary: "#FFEDED",
    tertiary: "",
    semanticPrimary: "#0FB951",
    semanticSecondary: "#C6C6C6",
    strokeDark: "",
    strokeMedium: "",
    strokeLight: "",
    overlayDull: "",
    overlayDark: "",
    overlayBright: "",
    error: "",
    success: "",
    failure: "",
    loaderPrimary: "rgba(170,170,170,0.4)",
    tableEvenRow: "#eeeeee",
    timeDisable: "#BABABA",
    timeSlot: "#F8FAFA"
  };
}

class AppFontSizes {
  static baseFontSizes = {
    vxs: 4,
    xxxs: 8,
    xxs: 10,
    xxs1: 11,
    xs: 12,
    xs1: 13,
    sm: 14,
    sm1: 15,
    md: 16,
    md1: 17,
    ml: 18,
    ml1: 19,
    lg: 20,
    xl: 22,
    xl1: 23,
    xl3: 25,
    xxl: 26,
    xxxl: 28,
    vxl: 32,
    vxl2: 34,
    vxxl: 40,
    vxxl8: 48,
    vxxxl: 50
  };

  static getDynamicSizes() {
    // No direct mutation
    const fontObj = Object.assign({}, AppFontSizes.baseFontSizes);
    const fF = fontFactor();
    for (const key in fontObj) {
      if (fontObj.hasOwnProperty(key)) {
        fontObj[key] = fontObj[key] + fF;
      }
    }
    return fontObj;
  }
}

export const getColor = (status) => {
  // console.log(status, 'setValue');
  if (status == "triage") return STATUS_TRIAGE;
  else if (status == "completed") return STATUS_COMPLETED;
  else if (status == "appointment booked") return STATUS_BOOKED;
  else if (status == "booked") return STATUS_BOOKED;
  else if (status == "inprocess") return STATUS_IN_PROCESS;
  else if (status == "in process") return STATUS_IN_PROCESS;
  else if (status == "cancelled") return STATUS_CANCELLED;
  else if (status == "Cancelled") return STATUS_CANCELLED;
  else if (status == "reconsulting") return STATUS_RECONSULTING;
  //reschedule with key value
  else if (status == "re consulting") return STATUS_RECONSULTING;
  else if (status == "closed") return STATUS_CLOSED;
  else if (status == "appointment rescheduled") return STATUS_RESCHEDULED;
  //reschedule without key value
  else if (status == "rescheduled") return STATUS_RESCHEDULED;
  else if (status == "undergoing") return STATUS_IN_PROCESS;
  else if (status == "confirm") return "#FF66B2";
  else if (status == "consulting") return "#FF6666";
  else if (status == "checkedin") return "#99CCFF";
  else if (status == "online") return STATUS_ONLINE;
  else if (status == "offline") return STATUS_OFFLINE;
  else if (status == 0) return "#FF0000";
  else if (status == 0.5) return "#FFBF00";
  else if (status == 1) return "#00B050";
  else if(status == 'paid')return '#6E4522';

};

export const getCardColor = (status) => {
  if (status == "triage") return "#CBF2FE";
  if (status == "completed") return "#E2FFEF";
  if (status == "appointment booked") return "#FFEDED";
  if (status == "booked") return "#FFEDED";
  if (status == "inprocess") return "#FEF7D2";
  if (status == "cancelled") return DEFAULT_SHADOW_COLOR;
  if (status == "Cancelled") return DEFAULT_SHADOW_COLOR;
  if (status == "closed") return "#FFEDED";
  if (status == "reconsulting") return "#BFF7FB";
  if (status == "appointment rescheduled") return "#DCE0FD";
  if (status == "reschedule") return "#DCE0FD";
  if (status == "rescheduled") return "#DCE0FD";
  if (status == "confirm") return "#8DF68C";
  if (status == "consulting") return "#C9E899";
  if (status == "checkedin") return "#C9E869";
  if (status == "undergoing") return "#FEF7D2";
  if(status == 'paid')return '#DEA057';
};

export const routeStatus = (appointmentType,alone, status) => {
  console.log("statusstatus",status)
  if(appointmentType=='online'){
    if (alone == true) {
      if (
        status === "booked" ||
        status === "completed" ||
        status === "closed" ||
        status === "inprocess" ||
        status === "cancelled"
      )
      return false;
      else return true;
    } else {
      if (
        status == "inprocess" ||
        status == "triage" ||
        status == "consulting" ||
        status == "confirm" ||
        status == "checkedin" ||
        status == "re consulting" ||
        status == "appointment rescheduled" ||
        status == "rescheduled"
      )
        return true;
      else if (
        
        status == "closed" ||
        status == "cancelled" ||
        status == "completed" ||
        status == "appointment booked" ||
        status == "booked"
      )
        return false;
    }
  }else{
  if (alone == true) {
    if (
      status === "booked" ||
      status === "completed" ||
      status === "closed" ||
      status === "inprocess" ||
      status === "cancelled" ||
      status == "appointment rescheduled" ||
      status == "appointment booked" ||
      status == "rescheduled"
    )
      return false;
    else return true;
  } else {
    if (
      status == "inprocess" ||
      status == "triage" ||
      status == "consulting" ||
      status == "confirm" ||
      status == "checkedin" ||
      status == "re consulting"
    )
      return true;
    else if (
      status == "appointment rescheduled" ||
      status == "closed" ||
      status == "cancelled" ||
      status == "completed" ||
      status == "appointment booked" ||
      status == "booked"
    )
      return false;
  }
}
};

class AppFontFamily {
  static baseFontFamily = {
    primaryRegular: "NunitoSans-Regular",
    primarySemiBold: "NunitoSans-SemiBold",
    primaryBold: "NunitoSans-Bold",
    secondaryRegular: "Roboto-Regular",
    secondaryMedium: "Roboto-Medium",
    secondaryBold: "Roboto-Bold"
  };
}

class AppFontWeights {
  static baseWeights = {
    regular: "400",
    semiBold: "600",
    bold: "800",
    darkBold: "1000"
  };
}

const modeColors = AppColors.LIGHT;

// First check if you are having the color you want in your corresponding component (button, background, text)
// If not there, then only refer to the app property
export const theme = {
  colors: {
    app: modeColors,
    button: {
      primary: modeColors.primary,
      secondary: modeColors.secondary
    },
    text: {
      primary: modeColors.semanticPrimary,
      secondary: modeColors.semanticSecondary,
      tertiary: modeColors.primary,
      error: modeColors.error
    },
    background: {
      primary: modeColors.secondary,
      secondary: modeColors.semanticSecondary,
      tertiary: modeColors.failure
    },
    loader: {
      primary: modeColors.loaderPrimary
    },
    overlay: {
      light: modeColors.overlayBright,
      dull: modeColors.overlayDull,
      dark: modeColors.overlayDark
    },
    border: {
      primary: modeColors.strokeMedium,
      secondary: modeColors.strokeDark,
      tertiary: modeColors.strokeLight
    },
    gradient: {
      primary: modeColors.gradientPrimary,
      secondary: modeColors.gradientSecondary,
      tertiary: modeColors.gradientTertiary
    },
    table: {
      primary: modeColors.tableEvenRow
    },
    time: {
      primary: modeColors.timeDisable,
      secondary: modeColors.timeSlot
    }
  },
  weights: AppFontWeights.baseWeights,
  fontFamily: AppFontFamily.baseFontFamily,
  fontSizes: AppFontSizes.getDynamicSizes(),
  fixedFontSizes: AppFontSizes.baseFontSizes,
  ...getDeviceSpecsForTheme()
};