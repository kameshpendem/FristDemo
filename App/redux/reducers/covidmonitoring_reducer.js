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
  SAVE_PATIENT_CONSENT_FAIL,
} from '../actionTypes';

const initialState = {
  loading: false,
  response: {},
  error: false,
};

export const practice_branch_list_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRACTICE_BRANCH_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };
    case GET_PRACTICE_BRANCH_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };
    case GET_PRACTICE_BRANCH_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const doctor_list_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DOCTOR_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_DOCTOR_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const covid_monitor_counts_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COVID_MONITOR_COUNT_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_COVID_MONITOR_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_COVID_MONITOR_COUNT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const covid_monitor_list_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COVID_MONITOR_LIST_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_COVID_MONITOR_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_COVID_MONITOR_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const covid_monitor_patient_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COVID_MONITOR_PATIENT_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_COVID_MONITOR_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_COVID_MONITOR_PATIENT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const covid_notes_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COVID_NOTES_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_COVID_NOTES_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_COVID_NOTES_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const standard_notes_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STANDARD_NOTES_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case GET_STANDARD_NOTES_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case GET_STANDARD_NOTES_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const save_covid_notes_data_reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_COVID_NOTES_DATA_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case SAVE_COVID_NOTES_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case SAVE_COVID_NOTES_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const close_encounter_status_reducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case CLOSE_ENCOUNTER_STATUS_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case CLOSE_ENCOUNTER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case CLOSE_ENCOUNTER_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const reopen_encounter_status_reducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REOPEN_ENCOUNTER_STATUS_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case REOPEN_ENCOUNTER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case REOPEN_ENCOUNTER_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const save_patient_consent_reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_PATIENT_CONSENT_LOAD:
      return {
        loading: true,
        response: {},
        error: false,
      };

    case SAVE_PATIENT_CONSENT_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.data,
      };

    case SAVE_PATIENT_CONSENT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};
