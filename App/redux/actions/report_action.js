import{REPORT_XP,REPORT_LOAD,REPORT_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getReportList(data) {
    return async (dispatch) => {
         dispatch(getReport())
        try{
const apiReq1=await API.call('post','dashboard_reportlist/',data)
console.log("koldfndkndsvk sdvnvvdsn"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getReportSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(getReportFailure(error))
        }  
    }
}
function getReport(){
    return{
        type:REPORT_LOAD
    }
}
function getReportSuccess(data){
    return{
        type:REPORT_XP,
        data
    }
}
function getReportFailure(){
    return{
        type:REPORT_FAIL
    }
}