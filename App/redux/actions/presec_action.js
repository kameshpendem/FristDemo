import{PRESEC_XP,PRESEC_LOAD,PRESEC_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getPresecList(data) {
    // data=data.replace(/|[\]/g, "")
    console.log(data)
    return async (dispatch) => {
         dispatch(getPresec())
        try{
console.log("achu123",data);
const apiReq1=await API.call('post','prescription_gen/',data)
// console.log("srikanth1435"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getPresecSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getPresecFailure(error))
        }  
    }
}
function getPresec(){
    return{
        type:PRESEC_LOAD
    }
}
function getPresecSuccess(data){
    return{
        type:PRESEC_XP,
        data
    }
}
function getPresecFailure(){
    return{
        type:PRESEC_FAIL
    }
}