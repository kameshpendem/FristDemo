import{FORGOT_XP,FORGOT_LOAD,FORGOT_FAIL} from '../actionTypes';
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
export function getForgotList(list) {
    return async (dispatch) => {
         dispatch(getForgot())
        try{
const apiReq2=await API.call('post','set_forgot_mail_doc/',list)
console.log("srikanth123"+JSON.stringify(apiReq2)+JSON.stringify(list))
await dispatch(getForgotSuccess(apiReq2));
        }catch(error){
            console.error(error);
            dispatch(getForgotFailure(error))
        }  
    }
}
function getForgot(){
    return{
        type:FORGOT_LOAD
    }
}
function getForgotSuccess(data){
    return{
        type:FORGOT_XP,
        data
    }
}
function getForgotFailure(){
    return{
        type:FORGOT_FAIL
    }
}