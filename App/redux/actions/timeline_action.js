import { TIME_XP, TIME_LOAD, TIME_FAIL } from "../actionTypes";
import API from "../../services/Api";
import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export function getTimeList(data) {
  return async (dispatch) => {
    dispatch(getTime());
    try {
      const apiReq1 = await API.call("post", "consult_timeline/", data);
      // console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
      await dispatch(getTimeSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getTimeFailure(error));
    }
  };
}
function getTime() {
  return {
    type: TIME_LOAD
  };
}
function getTimeSuccess(data) {
  return {
    type: TIME_XP,
    data
  };
}
function getTimeFailure() {
  return {
    type: TIME_FAIL
  };
}

export const getTimeline = async (variables) => {
  let url =
    getBaseUrl() + `v1/appointment/person-timeline/${variables.healpha_id}`;

  console.log(url, "getTimeline");

  let res = await ApiCall.get(url);
  console.log(res, "getTimeline1");

  return res.data;
};

// https://core.dev.rxconcent.com/api/v1/appointment/encounter/INDTGAAA000443-1-2122AAA000079/doctor/1136/person/INDAAA011374/vital

export const getCaptureVitals = async (variables) => {
  let url = "";
  if (variables.data == "all") {
    url =
      getBaseUrl() +
      // `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healpha_id}/vital`;
      `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healpha_id}/vital?is_all_vitals_req=true
      `;
  } else {
    url =
      getBaseUrl() +
      // `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healpha_id}/vital`;
      `v1/appointment/encounter/${variables.enc_id}/doctor/${
        variables.doc_id
      }/person/${variables.healpha_id}/vital?${
        variables.template_id
          ? `template_id=${variables.template_id}`
          : "is_default_template=true"
      }`;
  }
  let res = await ApiCall.get(url);
  return res.data;
};

export const getReceipts = async ({ healpha_id, enc_id }) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${healpha_id}/encounter/${enc_id}/receipts`;
  let res = await ApiCall.get(url);
  return res.data;
};
