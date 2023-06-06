import{ADDMED_XP,ADDMED_LOAD,ADDMED_FAIL,
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
const initialState = {
deleteTempMedicineList:[],
isTempMedicineDeleted:false,
error2:false,
deleteTempSupplementList:[],
isTempSupplementDeleted:false,
error3:false,
deleteTempLabList:[],
isTempLabDeleted:false,
error4:false,
deleteTempImgList:[],
isTempImgDeleted:false,
error5:false,
deleteTempNursingList:[],
isTempNursingDeleted:false,
error6:false,
getAddmedList: [],
isFetching21:false,
error:false
};
export const addmed_reducer= (state = initialState, action) => {
switch(action.type) {
    case ADDMED_LOAD:
    return {
    addmedList:[],
    isFetching21:true,
    error:false

    
    };
    case ADDMED_XP:
    return {
        ...state,
        addmedList:action.data,
        isFetching21:false,
    };
    case ADDMED_FAIL:
    return {
        ...state,
        isFetching21:false,
        error:true
    };
    default:
return state;
}
}

export const delete_temp_med_reducer= (state = initialState, action) => {
    switch(action.type) {
        case DELETE_TEMP_MEDICINE_LOAD:
        return {
        deleteTempMedicineList:[],
        isTempMedicineDeleted:true,
        error2:false
    
        
        };
        case DELETE_TEMP_MEDICINE_SUCCESS:
        return {
            ...state,
            deleteTempMedicineList:action.data,
            isTempMedicineDeleted:false,
        };
        case DELETE_TEMP_MEDICINE_FAIL:
        return {
            ...state,
            isTempMedicineDeleted:false,
            error2:true
        };
        default:
    return state;
    }
    }


export const delete_temp_sup_reducer= (state = initialState, action) => {
    switch(action.type) {
        case DELETE_TEMP_SUPPLEMENT_LOAD:
        return {
        deleteTempSupplementList:[],
        isTempSupplementDeleted:true,
        error3:false
    
        
        };
        case DELETE_TEMP_SUPPLEMENT_SUCCESS:
        return {
            ...state,
            deleteTempSupplementList:action.data,
            isTempSupplementDeleted:false,
        };
        case DELETE_TEMP_SUPPLEMENT_FAIL:
        return {
            ...state,
            isTempSupplementDeleted:false,
            error3:true
        };
        default:
    return state;
    }
    }

export const delete_temp_lab_reducer= (state = initialState, action) => {
    switch(action.type) {
        case DELETE_TEMP_LAB_LOAD:
        return {
        deleteTempLabList:[],
        isTempLabDeleted:true,
        error4:false
    
        
        };
        case DELETE_TEMP_LAB_SUCCESS:
        return {
            ...state,
            deleteTempLabList:action.data,
            isTempLabDeleted:false,
        };
        case DELETE_TEMP_LAB_FAIL:
        return {
            ...state,
            isTempLabDeleted:false,
            error4:true
        };
        default:
    return state;
    }
    }

    export const delete_temp_img_reducer= (state = initialState, action) => {
        switch(action.type) {
            case DELETE_TEMP_IMG_LOAD:
            return {
            deleteTempImgList:[],
            isTempImgDeleted:true,
            error5:false
        
            
            };
            case DELETE_TEMP_IMG_SUCCESS:
            return {
                ...state,
                deleteTempImgList:action.data,
                isTempImgDeleted:false,
            };
            case DELETE_TEMP_IMG_FAIL:
            return {
                ...state,
                isTempImgDeleted:false,
                error5:true
            };
            default:
        return state;
        }
        }


    export const delete_temp_nursing_reducer= (state = initialState, action) => {
        switch(action.type) {
            case DELETE_TEMP_NURSING_LOAD:
            return {
            deleteTempNursingList:[],
            isTempNursingDeleted:true,
            error6:false
        
            
            };
            case DELETE_TEMP_NURSING_SUCCESS:
            return {
                ...state,
                deleteTempNursingList:action.data,
                isTempNursingDeleted:false,
            };
            case DELETE_TEMP_NURSING_FAIL:
            return {
                ...state,
                isTempNursingDelete:false,
                error6:true
            };
            default:
        return state;
        }
        }
    
