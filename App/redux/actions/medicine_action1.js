import{MEDICINE1_XP,MEDICINE1_LOAD,MEDICINE1_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getMedicineList1(data) {
    return async (dispatch) => {
         dispatch(getMedicine1())
        try{
const apiReq1=await API.call('post','get_drug',data)
console.log("getMedicineList1"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getMedicineSuccess1(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getMedicineFailure1(error))
        }  
    }
}
function getMedicine1(){
    return{
        type:MEDICINE1_LOAD
    }
}
function getMedicineSuccess1(data){
    return{
        type:MEDICINE1_XP,
        data
    }
}
function getMedicineFailure1(){
    return{
        type:MEDICINE1_FAIL
    }
}