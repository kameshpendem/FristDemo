import {PATIENT_XP, PATIENT_LOAD, PATIENT_FAIL} from '../actionTypes';
import API from '../../services/Api';

// export function getPatientList(list) {
//     return async (dispatch) => {
//         try{
// const apiReq2=await API.call('post','http://192.168.1.23/cihealpha/api/doc_ical_list/',list)
// // console.log("srisri"+JSON.stringify(apiReq2)+" "+JSON.stringify(list))
// console.log(JSON.stringify(list))
// await dispatch({
//     type:PATIENT_XP,
//     payload:apiReq2
// });
//         }catch(error){
//             console.error(error);
//         }

//     }
// }
export function getPatientList(list) {
  return async (dispatch) => {
    dispatch(getPatient());
    try {
      const apiReq2 = await API.call('post', 'doc_ical_list/', list);
      // console.log("doc_ical_list"+JSON.stringify(apiReq2)+JSON.stringify(list))
      await dispatch(getPatientSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(getPatientFailure(error));
    }
  };
}
function getPatient() {
  return {
    type: PATIENT_LOAD,
  };
}
function getPatientSuccess(data) {
  return {
    type: PATIENT_XP,
    data,
  };
}
function getPatientFailure() {
  return {
    type: PATIENT_FAIL,
  };
}
