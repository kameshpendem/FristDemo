import{UPDATEMS_XP,UPDATEMS_LOAD,UPDATEMS_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getUpdatemsList(data) {
return async (dispatch) => {
dispatch(getUpdatems())
try{
const apiReq1=await API.call('post','update_prescription/',data)
console.log("getUpdatemsList"+JSON.stringify(apiReq1)+JSON.stringify(data))
await dispatch(getUpdatemsSuccess(apiReq1));
}catch(error){
console.error(error);
dispatch(getUpdatemsFailure(error))
}
}
}
function getUpdatems(){
return{
type:UPDATEMS_LOAD
}
}
function getUpdatemsSuccess(data){
return{
type:UPDATEMS_XP,
data
}
}
function getUpdatemsFailure(){
return{
type:UPDATEMS_FAIL
}
}