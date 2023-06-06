import { STATUS, FLAG } from "../../common/Constants";
export const encounterStatus = (str) => {
  if (str.toLowerCase() === "checkedin") {
    return "Checked In";
  } else if (str.toLowerCase() === "consulting") {
    return "Consulting";
  } else if (
    str.toLowerCase() === "undergoing" ||
    str.toLowerCase() === "undergoung"
  ) {
    return "In Process";
  } else if (str.toLowerCase() === "completed") {
    return "Completed";
  } else if (
    str.toLowerCase() === "cancelled" ||
    str.toLowerCase() === "Cancelled"
  ) {
    return "Cancelled";
  } else if (str.toLowerCase() === "appointment rescheduled") {
    return "Re-Scheduled";
  } else if (str.toLowerCase() === "reconsulting") {
    return "Re-Consulting";
  } else if (str.toLowerCase() === "appointment booked") {
    return "Booked";
  } else if (
    str.toLowerCase() === "Confirm" ||
    str.toLowerCase() === "confirm"
  ) {
    return "Confirm";
  } else if (str.toLowerCase() === "triage") {
    return "Triage";
  } else if (str.toLowerCase() === "Closed" || str.toLowerCase() === "closed") {
    return "Closed";
  } else {
    return null;
  }
};

export const reportsButton = (item) => {
  let flag = false;
  if (
    item["appointment_status"].toLowerCase() == "confirm" ||
    item["appointment_status"].toLowerCase() == "checkedin" ||
    item["appointment_status"].toLowerCase() == "undergoing" ||
    item["appointment_status"].toLowerCase() == "In Process" ||
    item["appointment_status"].toLowerCase() == "completed" ||
    item["appointment_status"].toLowerCase() == "Completed" ||
    item["appointment_status"].toLowerCase() == "reconsulting" ||
    item["appointment_status"].toLowerCase() == "triage" ||
    item["appointment_status"].toLowerCase() == "Triage" ||
    item["appointment_status"].toLowerCase() == "Closed" ||
    item["appointment_status"].toLowerCase() == "closed" ||
    item["appointment_status"].toLowerCase() == "appointment rescheduled" ||
    item["appointment_status"].toLowerCase() == "Re-Scheduled" ||
    item["appointment_status"].toLowerCase() == "completed" ||
    item["appointment_status"].toLowerCase() == "Completed" ||
    item["appointment_status"].toLowerCase() == "Consulting" ||
    item["appointment_status"].toLowerCase() == "consulting"
  ) {
    return true;
  } else {
    return flag;
  }
};

export const getOnlineButton = (item) => {
  let flag = false;
  if (
    item["appointment_status"].toLowerCase() == "checkedin" ||
    item["appointment_status"].toLowerCase() == "undergoing" ||
    item["appointment_status"].toLowerCase() == "In Process" ||
    item["appointment_status"].toLowerCase() == "confirm" ||
    item["appointment_status"].toLowerCase() == "Confirm" ||
    item["appointment_status"].toLowerCase() == "appointment rescheduled"
  ) {
    return true;
  } else {
    return flag;
  }
};

export const getVitalsButton = (item) => {
  let flag = false;
  if (
    item["appointment_status"].toLowerCase() == "checkedin" ||
    item["appointment_status"].toLowerCase() == "confirm" ||
    item["appointment_status"].toLowerCase() == "Confirm" ||
    item["appointment_status"].toLowerCase() == "appointment rescheduled" ||
    item["appointment_status"].toLowerCase() == "appointment rescheduled" ||
    item["appointment_status"].toLowerCase() == "undergoing" ||
    item["appointment_status"].toLowerCase() == "In Process" ||
    item["appointment_status"].toLowerCase() == "completed" ||
    item["appointment_status"].toLowerCase() == "Completed" ||
    item["appointment_status"].toLowerCase() == "reconsulting" ||
    item["appointment_status"].toLowerCase() == "Re-Scheduled" ||
    item["appointment_status"].toLowerCase() == "Closed" ||
    item["appointment_status"].toLowerCase() == "closed" ||
    item["appointment_status"].toLowerCase() == "Triage" ||
    item["appointment_status"].toLowerCase() == "triage"
  ) {
    return true;
  } else {
    return flag;
  }
};

export const getVitalsButton2 = (item) => {
  let flag = FLAG.FALSE;
  if (
    item["appointment_status"].toLowerCase() == STATUS.COMPLETED ||
    item["appointment_status"].toLowerCase() == STATUS.UNDER_PROCESS ||
    item["appointment_status"].toLowerCase() == STATUS.UNDERGOING ||
    item["appointment_status"].toLowerCase() == STATUS.INPROCESS ||
    item["appointment_status"].toLowerCase() == STATUS.RECONSULTING
  ) {
    return true;
  } else {
    return flag;
  }
};

export const getVitalsAddButton = (item) => {
  let flag = false;
  console.log("item", item);
  if (
    item.toLowerCase() == "completed" ||
    item.toLowerCase() == "under process" ||
    item.toLowerCase() == "undergoing" ||
    item.toLowerCase() == "reconsulting" ||
    item.toLowerCase() == "in process" ||
    item.toLowerCase() == "inprocess"
  ) {
    return true;
  } else {
    return flag;
  }
};

export const getVitalsButton3 = (item) => {
  let flag = false;
  if (
    item["appointment_status"].toLowerCase() == "triage" ||
    item["appointment_status"].toLowerCase() == "consulting" ||
    item["appointment_status"].toLowerCase() == "Consulting" ||
    item["appointment_status"].toLowerCase() == "consulting" ||
    item["appointment_status"].toLowerCase() == "closed"
  ) {
    return true;
  } else {
    return flag;
  }
};
export const PrescriptionButton = (item) => {
  let flag = false;
  if (
    item["appointment_status"].toLowerCase() == "In Process" ||
    item["appointment_status"].toLowerCase() == "reconsulting" ||
    item["appointment_status"].toLowerCase() == "completed" ||
    item["appointment_status"].toLowerCase() == "closed" ||
    item["appointment_status"].toLowerCase() == "undergoing"
  ) {
    return true;
  } else {
    return flag;
  }
};
export const PrescriptionButton2 = (item) => {
  let flag = FLAG.FALSE;
  if (
    item["status"].toLowerCase() == STATUS.INPROCESS ||
    item["status"].toLowerCase() == STATUS.RECONSULTING ||
    item["status"].toLowerCase() == STATUS.COMPLETED ||
    item["status"].toLowerCase() == STATUS.CLOSED ||
    item["status"].toLowerCase() == STATUS.UNDERGOING ||
    item["status"].toLowerCase() == STATUS.PRINTED
  ) {
    return true;
  } else {
    return flag;
  }
};
// export const reminderButton = (item) => {
//   let flag = false;
//   if (
//     item['appointment_status'].toLowerCase() != 'cancelled' &&
//     item['appointment_status'].toLowerCase() != 'Cancelled' &&
//     item['appointment_status'].toLowerCase() != 'checkedin' &&
//     item['appointment_status'].toLowerCase() != 'Checkedin' &&
//     item['appointment_status'].toLowerCase() != 'triage' &&
//     item['appointment_status'].toLowerCase() != 'confirm' &&
//     item['appointment_status'].toLowerCase() != 'Confirm' &&
//     item['appointment_status'].toLowerCase() != 'appointment rescheduled'
//   ) {
//     return true;
//   } else {
//     return flag;
//   }
// };
