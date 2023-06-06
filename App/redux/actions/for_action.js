import{FOR_XP,FOR_LOAD,FOR_FAIL} from '../actionTypes';
import API from '../../services/Api';
export function getForList(list) {
    return async (dispatch) => {
         dispatch(getFor())
        try{
const apiReq2=await API.call('post','nh_user_data/',list)
console.log("nh_user_data"+JSON.stringify(apiReq2)+JSON.stringify(list))
await dispatch(getForSuccess(apiReq2));
        }catch(error){
            console.error(error);
            dispatch(getForFailure(error))
        }  
    }
}
function getFor(){
    return{
        type:FOR_LOAD
    }
}
function getForSuccess(data){
    return{
        type:FOR_XP,
        data
    }
}
function getForFailure(){
    return{
        type:FOR_FAIL
    }
}