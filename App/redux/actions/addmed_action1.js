import {ADDMED1_XP, ADDMED1_LOAD, ADDMED1_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getAddmedList1(data) {
  return async (dispatch) => {
    dispatch(getAddmed1());
    try {
      const apiReq1 = await API.call('post', 'save_supplement/', data);
      // console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
      await dispatch(getAddmedSuccess1(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getAddmedFailure1(error));
    }
  };
}
function getAddmed1() {
  return {
    type: ADDMED1_LOAD,
  };
}
function getAddmedSuccess1(data) {
  return {
    type: ADDMED1_XP,
    data,
  };
}
function getAddmedFailure() {
  return {
    type: ADDMED1_FAIL,
  };
}
