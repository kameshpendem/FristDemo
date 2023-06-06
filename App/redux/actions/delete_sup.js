import{DELMED1_XP,DELMED1_LOAD,DELMED1_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getDelList1(data) {
    return async (dispatch) => {
         dispatch(getDel1())
        try{
const apiReq1=await API.call('post','delete_supplement/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getDelSuccess1(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getDelFailure1(error))
        }  
    }
}
function getDel1(){
    return{
        type:DELMED1_LOAD
    }
}
function getDelSuccess1(data){
    return{
        type:DELMED1_XP,
        data
    }
}
function getDelFailure1(){
    return{
        type:DELMED1_FAIL
    }
}