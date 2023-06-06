import{MEDICINE_XP,MEDICINE_LOAD,MEDICINE_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getMedicineList(data) {
    return async (dispatch) => {
         dispatch(getMedicine())
        try{
const apiReq1=await API.call('post','get_drug',data)
console.log("MedicineList"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getMedicineSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getMedicineFailure(error))
        }  
    }
}
function getMedicine(){
    return{
        type:MEDICINE_LOAD
    }
}
function getMedicineSuccess(data){
    return{
        type:MEDICINE_XP,
        data
    }
}
function getMedicineFailure(){
    return{
        type:MEDICINE_FAIL
    }
}