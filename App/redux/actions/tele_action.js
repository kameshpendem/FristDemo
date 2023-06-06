import{TELE_XP,TELE_LOAD,TELE_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getTeleList(data) {
    return async (dispatch) => {
         dispatch(getTele())
        try{
const apiReq1=await API.call('post','update_telereason/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getTeleSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getTeleFailure(error))
        }  
    }
}

function getTele(){
    return{
        type:TELE_LOAD
    }
}
function getTeleSuccess(data){
    return{
        type:TELE_XP,
        data
    }
}
function getTeleFailure(){
    return{
        type:TELE_FAIL
    }
}