import{NON_XP,NON_LOAD,NON_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getNonList(data) {
    return async (dispatch) => {
         dispatch(getNon())
        try{
const apiReq1=await API.call('post','doc_edit/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getNonSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getNonFailure(error))
        }  
    }
}
function getNon(){
    return{
        type:NON_LOAD
    }
}
function getNonSuccess(data){
    return{
        type:NON_XP,
        data
    }
}
function getNonFailure(){
    return{
        type:NON_FAIL
    }
}