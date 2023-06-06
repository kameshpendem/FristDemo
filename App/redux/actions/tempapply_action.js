import{APPLY_XP,APPLY_LOAD,APPLY_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getApplyList(data) {
    return async (dispatch) => {
         dispatch(getApply())
        try{
const apiReq1=await API.call('post','template_apply/',data)
console.log("kold"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getApplySuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getApplyFailure(error))
        }  
    }
}
function getApply(){
    return{
        type:APPLY_LOAD
    }
}
function getApplySuccess(data){
    return{
        type:APPLY_XP,
        data
    }
}
function getApplyFailure(){
    return{
        type:APPLY_FAIL
    }
}