import{CONSULT_XP,CONSULT_LOAD,CONSULT_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getConsultList(data) {
    return async (dispatch) => {
         dispatch(getConsult())
        try{
const apiReq1=await API.call('post','take_healid',data)
console.log("getConsultList"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getConsultSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getConsultFailure(error))
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
function getConsult(){
    return{
        type:CONSULT_LOAD
    }
}
function getConsultSuccess(data){
    return{
        type:CONSULT_XP,
        data
    }
}
function getConsultFailure(){
    return{
        type:CONSULT_FAIL
    }
}