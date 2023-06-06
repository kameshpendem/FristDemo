import{DELMED_XP,DELMED_LOAD,DELMED_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getDelList(data) {
    return async (dispatch) => {
         dispatch(getDel())
        try{
const apiReq1=await API.call('post','delete_prescription/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getDelSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getDelFailure(error))
        }  
    }
}
function getDel(){
    return{
        type:DELMED_LOAD
    }
}
function getDelSuccess(data){
    return{
        type:DELMED_XP,
        data
    }
}
function getDelFailure(){
    return{
        type:DELMED_FAIL
    }
}