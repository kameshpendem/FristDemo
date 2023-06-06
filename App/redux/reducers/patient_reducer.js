import {PATIENT_XP, PATIENT_LOAD, PATIENT_FAIL} from '../actionTypes';
const initialState = {
  patientList: [],
  isFetching1: true,
  error: false,
};
const patient_reducer = (state = initialState, action) => {
  switch (action.type) {
    case PATIENT_LOAD:
      return {
        patientList: [],
        isFetching1: true,
        error: false,
      };
    case PATIENT_XP:
      return {
        ...state,
        patientList: action.data,
        isFetching1: false,
      };
    case PATIENT_FAIL:
      return {
        ...state,
        isFetching1: false,
        error: true,
      };
    default:
      return state;
  }
};

export default patient_reducer;
