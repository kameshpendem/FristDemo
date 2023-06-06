import{DELETE_LAB_LOAD,
    DELETE_LAB_SUCCESS,
    DELETE_LAB_FAIL,
    DELETE_IMG_ORDER_LOAD,
    DELETE_IMG_ORDER_SUCCESS,
    DELETE_IMG_ORDER_FAIL,
    DELETE_NURSING_ORDER_LOAD,
    DELETE_NURSING_ORDER_SUCCESS,
    DELETE_NURSING_ORDER_FAIL,
    DELETE_VACCINE_ORDER_LOAD,
    DELETE_VACCINE_ORDER_SUCCESS,
    DELETE_VACCINE_ORDER_FAIL,
    DELETE_ALLERGY_FAIL,
    DELETE_ALLERGY_LOAD,
    DELETE_ALLERGY_XP,
    DELETE_TEMP_IMG_FAIL,
    DELETE_TEMP_IMG_LOAD,
    DELETE_TEMP_IMG_SUCCESS,
    DELETE_TEMP_LAB_LOAD,
    DELETE_TEMP_LAB_FAIL,
    DELETE_TEMP_LAB_SUCCESS,
    DELETE_TEMP_MEDICINE_FAIL,
    DELETE_TEMP_MEDICINE_LOAD,
    DELETE_TEMP_MEDICINE_SUCCESS,
    DELETE_TEMP_SUPPLEMENT_FAIL,
    DELETE_TEMP_SUPPLEMENT_SUCCESS,
    DELETE_TEMP_SUPPLEMENT_LOAD,
    DELETE_TEMP_NURSING_FAIL,
    DELETE_TEMP_NURSING_LOAD,
    DELETE_TEMP_NURSING_SUCCESS
} from '../actionTypes';
import API from '../../services/Api';

export function deleteLabOrderData(text) {
    // console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteLabOrderLoad())
        try{
const apiReq1=await API.call('post','delete_laborder/',text)
console.log("delete_laborder"+JSON.stringify(apiReq1))
await dispatch(deleteLabOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteLabOrderFailure(error))
        }  
    }
}
function deleteLabOrderLoad(){
    return{
        type:DELETE_LAB_LOAD
    }
}
function deleteLabOrderSuccess(data){
    return{
        type:DELETE_LAB_SUCCESS,
        data
    }
}
function deleteLabOrderFailure(){
    return{
        type:DELETE_LAB_FAIL
    }
}


export function deleteImagingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteImagingOrderLoad())
        try{
const apiReq1=await API.call('post','imaging_deletion',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteImagingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteImagingOrderFailure(error))
        }  
    }
}
function deleteImagingOrderLoad(){
    return{
        type:DELETE_IMG_ORDER_LOAD
    }
}
function deleteImagingOrderSuccess(data){
    return{
        type:DELETE_IMG_ORDER_SUCCESS,
        data
    }
}
function deleteImagingOrderFailure(){
    return{
        type:DELETE_IMG_ORDER_FAIL
    }
}


export function deleteNursingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteNursingOrderLoad())
        try{
const apiReq1=await API.call('post','nurse_service_deletion',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteNursingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteNursingOrderFailure(error))
        }  
    }
}
function deleteNursingOrderLoad(){
    return{
        type:DELETE_NURSING_ORDER_LOAD
    }
}
function deleteNursingOrderSuccess(data){
    return{
        type:DELETE_NURSING_ORDER_SUCCESS,
        data
    }
}
function deleteNursingOrderFailure(){
    return{
        type:DELETE_NURSING_ORDER_FAIL
    }
}



export function deleteVaccineOrderData(text) {
    console.log("srikanth="+text)
    return async (dispatch) => {
         dispatch(deleteVaccineOrderLoad())
        try{
const apiReq1=await API.call('post','vaccine_delete',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteVaccineOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteVaccineOrderFailure(error))
        }  
    }
}
function deleteVaccineOrderLoad(){
    return{
        type:DELETE_VACCINE_ORDER_LOAD
    }
}
function deleteVaccineOrderSuccess(data){
    return{
        type:DELETE_VACCINE_ORDER_SUCCESS,
        data
    }
}
function deleteVaccineOrderFailure(){
    return{
        type:DELETE_VACCINE_ORDER_FAIL
    }
}



export function deleteAllergyData(allergydata) {
    return async (dispatch) => {
         dispatch(deleteAllergyLoad())
        try{
const apiReq2=await API.call('post','/delete_allergy',allergydata)
console.log("srikanth"+JSON.stringify(apiReq2)+JSON.stringify(allergydata))
await dispatch(deleteAllergySuccess(apiReq2));
        }catch(error){
            console.error(error);
            dispatch(deleteAllergyFailure(error))
        }  
    }
}

function deleteAllergyFailure(){
    return{
        type:DELETE_ALLERGY_FAIL
    }
}

function deleteAllergyLoad(){
    return{
        type:DELETE_ALLERGY_LOAD
    }
}
function deleteAllergySuccess(data){
    return{
        type:DELETE_ALLERGY_XP,
        data
    }
}


export function deleteTempNursingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteTempNursingOrderLoad())
        try{
const apiReq1=await API.call('post','delete_temp_nursing',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteTempNursingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteTempNursingOrderFailure(error))
        }  
    }
}
function deleteTempNursingOrderLoad(){
    return{
        type:DELETE_TEMP_NURSING_LOAD
    }
}
function deleteTempNursingOrderSuccess(data){
    return{
        type:DELETE_TEMP_NURSING_SUCCESS,
        data
    }
}
function deleteTempNursingOrderFailure(){
    return{
        type:DELETE_TEMP_NURSING_FAIL
    }
}



export function deleteTempImagingOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteTempImagingOrderLoad())
        try{
const apiReq1=await API.call('post','delete_temp_imageordr',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteTempImagingOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteTempImagingOrderFailure(error))
        }  
    }
}
function deleteTempImagingOrderLoad(){
    return{
        type:DELETE_TEMP_IMG_LOAD
    }
}
function deleteTempImagingOrderSuccess(data){
    return{
        type:DELETE_TEMP_IMG_SUCCESS,
        data
    }
}
function deleteTempImagingOrderFailure(){
    return{
        type:DELETE_TEMP_IMG_FAIL
    }
}




export function deleteTempLabOrderData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteTempLabOrderLoad())
        try{
const apiReq1=await API.call('post','delete_temp_laborder',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteTempLabOrderSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteTempLabOrderFailure(error))
        }  
    }
}
function deleteTempLabOrderLoad(){
    return{
        type:DELETE_TEMP_LAB_LOAD
    }
}
function deleteTempLabOrderSuccess(data){
    return{
        type:DELETE_TEMP_LAB_SUCCESS,
        data
    }
}
function deleteTempLabOrderFailure(){
    return{
        type:DELETE_TEMP_LAB_FAIL
    }
}



export function deleteTempMedicineData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteTempMedicineLoad())
        try{
const apiReq1=await API.call('post','delete_temp_medicine',text)
console.log("srikanth420"+JSON.stringify(apiReq1))
await dispatch(deleteTempMedicineSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteTempMedicineFailure(error))
        }  
    }
}
function deleteTempMedicineLoad(){
    return{
        type:DELETE_TEMP_MEDICINE_LOAD
    }
}
function deleteTempMedicineSuccess(data){
    return{
        type:DELETE_TEMP_MEDICINE_SUCCESS,
        data
    }
}
function deleteTempMedicineFailure(){
    return{
        type:DELETE_TEMP_MEDICINE_FAIL
    }
}



export function deleteTempSupplementData(text) {
    console.log("srikanth="+JSON.stringify(text))
    return async (dispatch) => {
         dispatch(deleteTempSupplementLoad())
        try{
const apiReq1=await API.call('post','delete_temp_supplement',text)
console.log("srikanth"+JSON.stringify(apiReq1))
await dispatch(deleteTempSupplementSuccess(apiReq1));
        }catch(error){
            console.error(error);
            dispatch(deleteTempSupplementFailure(error))
        }  
    }
}
function deleteTempSupplementLoad(){
    return{
        type:DELETE_TEMP_SUPPLEMENT_LOAD
    }
}
function deleteTempSupplementSuccess(data){
    return{
        type:DELETE_TEMP_SUPPLEMENT_SUCCESS,
        data
    }
}
function deleteTempSupplementFailure(){
    return{
        type:DELETE_TEMP_SUPPLEMENT_FAIL
    }
}
