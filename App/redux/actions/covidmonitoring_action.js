import {
  GET_PRACTICE_BRANCH_LOAD,
  GET_PRACTICE_BRANCH_SUCCESS,
  GET_PRACTICE_BRANCH_FAIL,
  GET_DOCTOR_LOAD,
  GET_DOCTOR_SUCCESS,
  GET_DOCTOR_FAIL,
  GET_COVID_MONITOR_COUNT_LOAD,
  GET_COVID_MONITOR_COUNT_SUCCESS,
  GET_COVID_MONITOR_COUNT_FAIL,
  GET_COVID_MONITOR_LIST_LOAD,
  GET_COVID_MONITOR_LIST_SUCCESS,
  GET_COVID_MONITOR_LIST_FAIL,
  GET_COVID_MONITOR_PATIENT_LOAD,
  GET_COVID_MONITOR_PATIENT_SUCCESS,
  GET_COVID_MONITOR_PATIENT_FAIL,
  GET_COVID_NOTES_LOAD,
  GET_COVID_NOTES_SUCCESS,
  GET_COVID_NOTES_FAIL,
  GET_STANDARD_NOTES_LOAD,
  GET_STANDARD_NOTES_SUCCESS,
  GET_STANDARD_NOTES_FAIL,
  SAVE_COVID_NOTES_DATA_LOAD,
  SAVE_COVID_NOTES_DATA_SUCCESS,
  SAVE_COVID_NOTES_DATA_FAIL,
  CLOSE_ENCOUNTER_STATUS_LOAD,
  CLOSE_ENCOUNTER_STATUS_SUCCESS,
  CLOSE_ENCOUNTER_STATUS_FAIL,
  REOPEN_ENCOUNTER_STATUS_LOAD,
  REOPEN_ENCOUNTER_STATUS_SUCCESS,
  REOPEN_ENCOUNTER_STATUS_FAIL,
  SAVE_PATIENT_CONSENT_LOAD,
  SAVE_PATIENT_CONSENT_SUCCESS,
  SAVE_PATIENT_CONSENT_FAIL
} from "../actionTypes";
import API from "../../services/Api";

export function getPracticeBranchList(payload) {
  return async (dispatch) => {
    dispatch(load(GET_PRACTICE_BRANCH_LOAD));
    try {
      const response = await API.call(
        "post",
        "get_practice_branch_list/",
        payload
      );
      await dispatch(success(GET_PRACTICE_BRANCH_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_PRACTICE_BRANCH_FAIL));
    }
  };
}

export function getDoctorList(payload) {
  return async (dispatch) => {
    dispatch(load(GET_DOCTOR_LOAD));
    try {
      const response = await API.call("post", "get_doctor_list/", payload);
      await dispatch(success(GET_DOCTOR_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_DOCTOR_FAIL));
    }
  };
}

export function getCovidMonitorCounts(payload) {
  return async (dispatch) => {
    dispatch(load(GET_COVID_MONITOR_COUNT_LOAD));
    try {
      const response = await API.call(
        "post",
        "get_covid_monitor_count/",
        payload
      );
      await dispatch(success(GET_COVID_MONITOR_COUNT_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_COVID_MONITOR_COUNT_FAIL));
    }
  };
}

export function getCovidMonitorList(payload) {
  return async (dispatch) => {
    dispatch(load(GET_COVID_MONITOR_LIST_LOAD));
    try {
      const response = await API.call(
        "post",
        "get_covid_monitor_list/",
        payload
      );
      await dispatch(success(GET_COVID_MONITOR_LIST_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_COVID_MONITOR_LIST_FAIL));
    }
  };
}

export function getCovidMonitorPatient(payload) {
  return async (dispatch) => {
    dispatch(load(GET_COVID_MONITOR_PATIENT_LOAD));
    try {
      const response = await API.call(
        "post",
        "get_covid_monitor_patient/",
        payload
      );
      await dispatch(success(GET_COVID_MONITOR_PATIENT_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_COVID_MONITOR_PATIENT_FAIL));
    }
  };
}

export function getCovidNotes(payload) {
  return async (dispatch) => {
    dispatch(load(GET_COVID_NOTES_LOAD));
    try {
      const response = await API.call("post", "get_covid_notes/", payload);
      await dispatch(success(GET_COVID_NOTES_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_COVID_NOTES_FAIL));
    }
  };
}

export function getStandardNotes(payload) {
  return async (dispatch) => {
    dispatch(load(GET_STANDARD_NOTES_LOAD));
    try {
      const response = await API.call("post", "get_standard_notes/", payload);
      await dispatch(success(GET_STANDARD_NOTES_SUCCESS, response));
    } catch (error) {
      dispatch(failure(GET_STANDARD_NOTES_FAIL));
    }
  };
}

export function saveCovidNotesData(payload) {
  return async (dispatch) => {
    dispatch(load(SAVE_COVID_NOTES_DATA_LOAD));
    try {
      const response = await API.call(
        "post",
        "save_covid_notes_data/",
        payload
      );
      await dispatch(success(SAVE_COVID_NOTES_DATA_SUCCESS, response));
    } catch (error) {
      dispatch(failure(SAVE_COVID_NOTES_DATA_FAIL));
    }
  };
}

export function closeEncounterStatus(payload) {
  return async (dispatch) => {
    dispatch(load(CLOSE_ENCOUNTER_STATUS_LOAD));
    try {
      const response = await API.call(
        "post",
        "update_close_enc_status/",
        payload
      );
      await dispatch(success(CLOSE_ENCOUNTER_STATUS_SUCCESS, response));
    } catch (error) {
      dispatch(failure(CLOSE_ENCOUNTER_STATUS_FAIL));
    }
  };
}

export function reopenEncounterStatus(payload) {
  return async (dispatch) => {
    dispatch(load(REOPEN_ENCOUNTER_STATUS_LOAD));
    try {
      const response = await API.call(
        "post",
        "update_open_enc_status/",
        payload
      );
      await dispatch(success(REOPEN_ENCOUNTER_STATUS_SUCCESS, response));
    } catch (error) {
      dispatch(failure(REOPEN_ENCOUNTER_STATUS_FAIL));
    }
  };
}

export function savePatientConsent(payload) {
  return async (dispatch) => {
    dispatch(load(SAVE_PATIENT_CONSENT_LOAD));
    try {
      const response = await API.call(
        "post",
        "generate_patient_consent/",
        payload
      );
      await dispatch(success(SAVE_PATIENT_CONSENT_SUCCESS, response));
    } catch (error) {
      dispatch(failure(SAVE_PATIENT_CONSENT_FAIL));
    }
  };
}

function load(type) {
  return {
    type
  };
}

function success(type, data) {
  return {
    type,
    data
  };
}

function failure(type) {
  return {
    type
  };
}
