import {OLDPATIENT_XP, OLDPATIENT_LOAD, OLDPATIENT_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getOldList(data) {
  return async (dispatch) => {
    dispatch(getOld());
    try {
      const apiReq1 = await API.call('post', 'dashboard_timelinelist/', data);
      await dispatch(getOldSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getOldFailure(error));
    }
  };
}
// https://test.healpha.com//api/doctor_details_by_id
// export function fetchDocFromAPI(docid){
//     return async(dispatch)=>{
//         dispatch(getDoc())
//         const apiReq=await API.call('post','doctor_details_by_id',docid)
//         .then(res =>res.json())
//         .then(json =>dispatch(getDocSuccess(json.results)))
//         .catch(err=>dispatch(getDocFailure(err)))
//     }
// }
function getOld() {
  return {
    type: OLDPATIENT_LOAD,
  };
}
function getOldSuccess(data) {
  return {
    type: OLDPATIENT_XP,
    data,
  };
}
function getOldFailure() {
  return {
    type: OLDPATIENT_FAIL,
  };
}
