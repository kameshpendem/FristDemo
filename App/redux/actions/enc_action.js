import{ENC_XP,ENC_LOAD,ENC_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getEncList(data) {
    return async (dispatch) => {
         dispatch(getEnc())
        try{
const apiReq1=await API.call('post','dashboard_enclist/',data)
console.log("koldfndkndsvk sdvnvvdsn"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getEncSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getEncFailure(error))
        }  
    }
}
// https://test.healpha.com//api/doctor_details_by_id
// export function fetchDocFromAPI(docid){
//     return async(dispatch)=>{
//         dispatch(getDoc())
//         const apiReq=await API.call('post','doctor_details_by_id',docid)
//         .then(res =>res.json())
//         .then(json =>dispatch(getDocSuccess(json.results)))
//         .catch(err=>dispatch(getDocFailure(err)))
//     }
// }
function getEnc(){
    return{
        type:ENC_LOAD
    }
}
function getEncSuccess(data){
    return{
        type:ENC_XP,
        data
    }
}
function getEncFailure(){
    return{
        type:ENC_FAIL
    }
}