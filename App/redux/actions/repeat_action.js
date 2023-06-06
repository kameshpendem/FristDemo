import{REPEAT_LAB_LOAD,
    REPEAT_LAB_SUCCESS,
    REPEAT_LAB_FAIL,
    REPEAT_ALL_LAB_LOAD,
    REPEAT_ALL_LAB_SUCCESS,
    REPEAT_ALL_LAB_FAIL,
    REPEAT_IMAGING_LOAD,
    REPEAT_IMAGING_SUCCESS,
    REPEAT_IMAGING_FAIL,
    REPEAT_ALL_IMAGING_LOAD,
    REPEAT_ALL_IMAGING_SUCCESS,
    REPEAT_ALL_IMAGING_FAIL
} from '../actionTypes';
import API from '../../services/Api';

export function repeatLabOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(repeatLabOrderLoad())
        try{
const apiReq1=await API.call('post','repeatlab/',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(repeatLabOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(repeatLabOrderFailure(error))
        }  
    }
}
function repeatLabOrderLoad(){
    return{
        type:REPEAT_LAB_LOAD
    }
}
function repeatLabOrderSuccess(data){
    return{
        type:REPEAT_LAB_SUCCESS,
        data
    }
}
function repeatLabOrderFailure(){
    return{
        type:REPEAT_LAB_FAIL
    }
}

export function repeatAllLabOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(repeatAllLabOrderLoad())
        try{
const apiReq1=await API.call('post','repeatall/',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(repeatAllLabOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(repeatAllLabOrderFailure(error))
        }  
    }
}
function repeatAllLabOrderLoad(){
    return{
        type:REPEAT_ALL_LAB_LOAD
    }
}
function repeatAllLabOrderSuccess(data){
    return{
        type:REPEAT_ALL_LAB_SUCCESS,
        data
    }
}
function repeatAllLabOrderFailure(){
    return{
        type:REPEAT_ALL_LAB_FAIL
    }
}


export function repeatImagingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(repeatImagingOrderLoad())
        try{
const apiReq1=await API.call('post','repeatimaging/',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(repeatImagingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(repeatImagingOrderFailure(error))
        }  
    }
}
function repeatImagingOrderLoad(){
    return{
        type:REPEAT_IMAGING_LOAD
    }
}
function repeatImagingOrderSuccess(data){
    return{
        type:REPEAT_IMAGING_SUCCESS,
        data
    }
}
function repeatImagingOrderFailure(){
    return{
        type:REPEAT_IMAGING_FAIL
    }
}



export function repeatAllImagingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(repeatAllImagingOrderLoad())
        try{
const apiReq1=await API.call('post','repeatallimg/',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(repeatAllImagingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(repeatAllImagingOrderFailure(error))
        }  
    }
}
function repeatAllImagingOrderLoad(){
    return{
        type:REPEAT_ALL_IMAGING_LOAD
    }
}
function repeatAllImagingOrderSuccess(data){
    return{
        type:REPEAT_ALL_IMAGING_SUCCESS,
        data
    }
}
function repeatAllImagingOrderFailure(){
    return{
        type:REPEAT_ALL_IMAGING_FAIL
    }
}

