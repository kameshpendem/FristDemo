import{IMMUN1_XP,IMMUN1_LOAD,IMMUN1_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getImmunupdateList(data) {
    return async (dispatch) => {
         dispatch(getImmunupdate())
        try{
const apiReq1=await API.call('post','doc_immun_update/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getImmunupdateSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getImmunupdateFailure(error))
        }  
    }
}
function getImmunupdate(){
    return{
        type:IMMUN1_LOAD
    }
}
function getImmunupdateSuccess(data){
    return{
        type:IMMUN1_XP,
        data
    }
}
function getImmunupdateFailure(){
    return{
        type:IMMUN1_FAIL
    }
}