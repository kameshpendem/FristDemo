import{VALIDATE_XP,VALIDATE_LOAD,VALIDATE_FAIL} from '../actionTypes';
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
export function getValidateList(list) {
    return async (dispatch) => {
         dispatch(getValidate())
        try{
const apiReq2=await API.call('post','vitals_json',list)
//console.log("srikanth vitals"+JSON.stringify(apiReq2)+JSON.stringify(list))
await dispatch(getValidateSuccess(apiReq2));
        }catch(error){
            console.error(error);
            dispatch(getValidateFailure(error))
        }  
    }
}
function getValidate(){
    return{
        type:VALIDATE_LOAD
    }
}
function getValidateSuccess(data){
    return{
        type:VALIDATE_XP,
        data
    }
}
function getValidateFailure(){
    return{
        type:VALIDATE_FAIL
    }
}