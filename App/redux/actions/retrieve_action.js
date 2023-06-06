import {
  RETRIEVE_NURSE_VITALS_SUCCESS,
  RETRIEVE_NURSE_VITALS_LOAD,
  RETRIEVE_NURSE_VITALS_FAIL,
  RETRIEVE_PERSON_TIMELINE_LOAD,
  RETRIEVE_PERSON_TIMELINE_SUCCESS,
  RETRIEVE_PERSON_TIMELINE_FAIL,
  RETRIEVE_VACCINE_ORDER_SUCCESS,
  RETRIEVE_VACCINE_ORDER_LOAD,
  RETRIEVE_VACCINE_ORDER_FAIL,
  SERVICES_FAIL,
  SERVICES_LOAD,
  SERVICES_SUCCESS,
  HISTORY_FAIL,
  HISTORY_LOAD,
  HISTORY_XP,
  DOCTOR_FAIL,
  DOCTOR_LOAD,
  DOCTOR_XP,
} from '../actionTypes';
import API from '../../services/Api';

export function getNurseVitalsData(text) {
  //   console.log('srikanth=' + JSON.stringify(text));
  return async (dispatch) => {
    dispatch(getNurseVitalsLoad());
    try {
      const apiReq1 = await API.call('post', 'vitals_voicetext', text);
      //   console.log('srikanth' + JSON.stringify(apiReq1));
      await dispatch(getNurseVitalsSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getNurseVitalsFailure(error));
    }
  };
}
function getNurseVitalsLoad() {
  return {
    type: RETRIEVE_NURSE_VITALS_LOAD,
  };
}
function getNurseVitalsSuccess(data) {
  return {
    type: RETRIEVE_NURSE_VITALS_SUCCESS,
    data,
  };
}
function getNurseVitalsFailure() {
  return {
    type: RETRIEVE_NURSE_VITALS_FAIL,
  };
}

export function getPersonTimelineData(text) {
  //   console.log('srikanth=' + JSON.stringify(text));
  return async (dispatch) => {
    dispatch(getPersonTimelineLoad());
    try {
      const apiReq1 = await API.call('post', 'timeline', text);
      //   console.log('srikanth' + JSON.stringify(apiReq1));
      await dispatch(getPersonTimelineSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getPersonTimelineFailure(error));
    }
  };
}

export function getDoctorData(text) {
  // console.log('srikanth=' + JSON.stringify(text));
  return async (dispatch) => {
    dispatch(getDoctorLoad());
    try {
      const apiReq1 = await API.call('post', 'get_doctor_data/', text);
      // console.log('srikanth' + JSON.stringify(apiReq1));
      await dispatch(getDoctorSuccess(apiReq1));
    } catch (error) {
      console.error(error, 'getDoctorData');
      dispatch(getDoctorFailure(error));
    }
  };
}
function getDoctorLoad() {
  return {
    type: DOCTOR_LOAD,
  };
}
function getDoctorSuccess(data) {
  return {
    type: DOCTOR_XP,
    data,
  };
}
function getDoctorFailure() {
  return {
    type: DOCTOR_FAIL,
  };
}
function getPersonTimelineLoad() {
  return {
    type: RETRIEVE_PERSON_TIMELINE_LOAD,
  };
}
function getPersonTimelineSuccess(data) {
  return {
    type: RETRIEVE_PERSON_TIMELINE_SUCCESS,
    data,
  };
}
function getPersonTimelineFailure() {
  return {
    type: RETRIEVE_PERSON_TIMELINE_FAIL,
  };
}

export function getVaccineOrderData(text) {
  //   console.log('srikanth=' + JSON.stringify(text));
  return async (dispatch) => {
    dispatch(getVaccineOrderLoad());
    try {
      const apiReq1 = await API.call('post', 'getvaccine', text);
      //   console.log('srikanth' + JSON.stringify(apiReq1));
      await dispatch(getVaccineOrderSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getVaccineOrderFailure(error));
    }
  };
}
function getVaccineOrderLoad() {
  return {
    type: RETRIEVE_VACCINE_ORDER_LOAD,
  };
}
function getVaccineOrderSuccess(data) {
  return {
    type: RETRIEVE_VACCINE_ORDER_SUCCESS,
    data,
  };
}
function getVaccineOrderFailure() {
  return {
    type: RETRIEVE_VACCINE_ORDER_FAIL,
  };
}

export function getPlanServicesData(text) {
  //   console.log('srikanth=' + text);
  return async (dispatch) => {
    dispatch(getPlanServicesLoad());
    try {
      const apiReq1 = await API.call('post', 'plan_service', text);
      //   console.log('plan_service' + JSON.stringify(apiReq1));
      await dispatch(getPlanServicesSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getPlanServicesFailure(error));
    }
  };
}
function getPlanServicesLoad() {
  return {
    type: SERVICES_LOAD,
  };
}
function getPlanServicesSuccess(data) {
  return {
    type: SERVICES_SUCCESS,
    data,
  };
}
function getPlanServicesFailure() {
  return {
    type: SERVICES_FAIL,
  };
}

export function getHistoryData(text) {
  //   console.log('srikanth=' + text);
  return async (dispatch) => {
    dispatch(getHistoryLoad());
    try {
      const apiReq1 = await API.call('post', '/allergy_json/', text);
      //   console.log('srikanth' + JSON.stringify(apiReq1) + ' ' + text);
      await dispatch(getHistorySuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getHistoryFailure(error));
    }
  };
}
function getHistoryLoad() {
  return {
    type: HISTORY_LOAD,
  };
}
function getHistorySuccess(data) {
  return {
    type: HISTORY_XP,
    data,
  };
}
function getHistoryFailure() {
  return {
    type: HISTORY_FAIL,
  };
}
