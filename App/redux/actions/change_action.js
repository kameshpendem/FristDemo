import{CHANGE_XP,CHANGE_LOAD,CHANGE_FAIL} from '../actionTypes';
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
export function getChangeList(list) {
    return async (dispatch) => {
         dispatch(getChange())
        try{
const apiReq2=await API.call('post','nonhealpha_change_password/',list)
// console.log("srikanth"+JSON.stringify(apiReq2)+JSON.stringify(list))
await dispatch(getChangeSuccess(apiReq2));
        }catch(error){
            console.error(error);
            dispatch(getChangeFailure(error))
        }  
    }
}
function getChange(){
    return{
        type:CHANGE_LOAD
    }
}
function getChangeSuccess(data){
    return{
        type:CHANGE_XP,
        data
    }
}
function getChangeFailure(){
    return{
        type:CHANGE_FAIL
    }
}