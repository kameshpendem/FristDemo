import {ADDMED_XP, ADDMED_LOAD, ADDMED_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getAddmedList(data) {
  return async (dispatch) => {
    dispatch(getAddmed());
    try {
      const apiReq1 = await API.call('post', 'save_prescription/', data);
      await dispatch(getAddmedSuccess(apiReq1));
    } catch (error) {
      dispatch(getAddmedFailure(error));
    }
  };
}
function getAddmed() {
  return {
    type: ADDMED_LOAD,
  };
}
function getAddmedSuccess(data) {
  return {
    type: ADDMED_XP,
    data,
  };
}
function getAddmedFailure() {
  return {
    type: ADDMED_FAIL,
  };
}
