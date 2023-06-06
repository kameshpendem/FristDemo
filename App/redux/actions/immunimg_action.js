import{IMMUN2_XP,IMMUN2_LOAD,IMMUN2_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getImmunimgList(data) {
    return async (dispatch) => {
         dispatch(getImmunimg())
        try{
const apiReq1=await API.call('post','doc_immun_update/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getImmunimgSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getImmunimgFailure(error))
        }  
    }
}
function getImmunimg(){
    return{
        type:IMMUN2_LOAD
    }
}
function getImmunimgSuccess(data){
    return{
        type:IMMUN2_XP,
        data
    }
}
function getImmunimgFailure(){
    return{
        type:IMMUN2_FAIL
    }
}