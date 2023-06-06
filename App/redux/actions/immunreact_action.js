import{IMMUN_XP,IMMUN_LOAD,IMMUN_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getImmunreactList(data) {
    return async (dispatch) => {
         dispatch(getImmunreact())
        try{
const apiReq1=await API.call('post','doc_immun_data_react',data)
// console.log("srikanth14356"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getImmunreactSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getImmunreactFailure(error))
        }  
    }
}
function getImmunreact(){
    return{
        type:IMMUN_LOAD
    }
}
function getImmunreactSuccess(data){
    return{
        type:IMMUN_XP,
        data
    }
}
function getImmunreactFailure(){
    return{
        type:IMMUN_FAIL
    }
}