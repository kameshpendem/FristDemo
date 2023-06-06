import {CHANGE_TAB_SUCCESS} from '../actionTypes';
export function changeTabData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
        const apiReq1=text;
         dispatch(ChangeTabSuccess(apiReq1))
    }
}

function ChangeTabSuccess(data){
    return{
        type:CHANGE_TAB_SUCCESS,
        data
    }
}