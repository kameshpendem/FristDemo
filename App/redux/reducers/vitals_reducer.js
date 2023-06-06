import {
  SAVE_VITALS_SUCCESS,
  SAVE_VITALS_LOAD,
  SAVE_VITALS_FAIL,
  RETRIEVE_NURSE_VITALS_FAIL,
  RETRIEVE_NURSE_VITALS_SUCCESS,
  RETRIEVE_NURSE_VITALS_LOAD,
  SAVE_PLAN_LOAD,
  SAVE_PLAN_SUCCESS,
  SAVE_PLAN_FAIL,
  GET_VITALS_LABEL,
} from '../actionTypes';

const initialState = {
  vitals_save_response: '',
  plan_save_response: '',
  vitals_retrieve_response: '',
  isFetching: false,
  isSaving: false,
  isSavingPlan: false,
  vitals_save_error: false,
  vitals_retrieve_error: false,
  error3: false,
  vitalsLabels: {},
};
export const vitals_reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_VITALS_LOAD:
      return {
        vitals_save_response: '',
        isSaving: true,
        vitals_save_error: false,
      };
    case SAVE_VITALS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        vitals_save_response: action.data,
      };
    case SAVE_VITALS_FAIL:
      return {
        ...state,
        isSaving: false,
        vitals_save_error: true,
      };
    case RETRIEVE_NURSE_VITALS_LOAD:
      return {
        vitals_retrieve_response: '',
        isFetching: true,
        vitals_retrieve_error: false,
      };
    case RETRIEVE_NURSE_VITALS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        vitals_retrieve_response: action.data,
      };
    case RETRIEVE_NURSE_VITALS_FAIL:
      return {
        ...state,
        isFetching: false,
        vitals_retrieve_error: true,
      };
    default:
      return state;
  }
};

export const save_plan_reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_PLAN_LOAD:
      return {
        plan_save_response: [],
        isSavingPlan: true,
        error3: false,
      };
    case SAVE_PLAN_SUCCESS:
      return {
        ...state,
        isSavingPlan: false,
        plan_save_response: action.data,
      };
    case SAVE_PLAN_FAIL:
      return {
        ...state,
        isSaving: false,
        error3: true,
      };
    default:
      return state;
  }
};

export const vital_labels_reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VITALS_LABEL:
      return {
        vitalsLabels: action.data,
      };
    default:
      return state;
  }
};
