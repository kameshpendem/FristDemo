import{
ADD_ALLERGY_FAIL,
ADD_ALLERGY_LOAD,
ADD_ALLERGY_XP,
ADD_SSM_XP,
ADD_SSM_FAIL,
ADD_SSM_LOAD,
DELETE_ALLERGY_FAIL,
DELETE_ALLERGY_LOAD,
DELETE_ALLERGY_XP,
UPDATE_ALLERGY_XP,
UPDATE_ALLERGY_FAIL,
UPDATE_ALLERGY_LOAD,
HISTORY_FAIL,
HISTORY_LOAD,
HISTORY_XP,
DOCTOR_FAIL,DOCTOR_LOAD,DOCTOR_XP
} from '../actionTypes';
const initialState = {
SaveAllergyResponse: [],
SaveSsmResponse: [],
DeleteAllergyResponse: [],
UpdateAllergyResponse: [],
getDoctorData:[],
HistoryResponse:[],
isSavingAllergy:false,
isSavingSsm:false,
isDeletingAllergy:false,
isUpdatingAllergy:false,
isFetchingHistory:false,
DoctorDataFetching:false,
error:false,
error1:false,
error2:false,
error3:false,
error4:false,
error5:false
};
export const save_allergy_reducer= (state = initialState, action) => {
switch(action.type) {
    case ADD_ALLERGY_LOAD:
    return {
    SaveAllergyResponse:[],
    isSavingAllergy:true,
    error:false

    
    };
    case ADD_ALLERGY_XP:
    return {
        ...state,
        SaveAllergyResponse:action.data,
        isSavingAllergy:false,
    };
    case ADD_ALLERGY_FAIL:
    return {
        ...state,
        isSavingAllergy:false,
        error:true
    };
    default:
return state;
}
}


export const save_ssm_reducer= (state = initialState, action) => {
    switch(action.type) {
        case ADD_SSM_LOAD:
        return {
        SaveSsmResponse:[],
        isSavingSsm:true,
        error1:false
    
        
        };
        case ADD_SSM_XP:
        return {
            ...state,
            SaveSsmResponse:action.data,
            isSavingSsm:false,
        };
        case ADD_SSM_FAIL:
        return {
            ...state,
            isSavingSsm:false,
            error1:true
        };
        default:
    return state;
    }
    }

    export const delete_allergy_reducer= (state = initialState, action) => {
        switch(action.type) {
            case DELETE_ALLERGY_LOAD:
            return {
            DeleteAllergyResponse:[],
            isDeletingAllergy:true,
            error2:false
        
            
            };
            case DELETE_ALLERGY_XP:
            return {
                ...state,
                DeleteAllergyResponse:action.data,
                isDeletingAllergy:false,
            };
            case DELETE_ALLERGY_FAIL:
            return {
                ...state,
                isDeletingAllergy:false,
                error2:true
            };
            default:
        return state;
        }
        }
        
        
        export const update_allergy_reducer= (state = initialState, action) => {
            switch(action.type) {
                case UPDATE_ALLERGY_LOAD:
                return {
                UpdateAllergyResponse:[],
                isUpdatingAllergy:true,
                error3:false
                };
                case UPDATE_ALLERGY_XP:
                return {
                    ...state,
                    UpdateAllergyResponse:action.data,
                    isUpdatingAllergy:false,
                };
                case UPDATE_ALLERGY_FAIL:
                return {
                    ...state,
                    isUpdatingAllergy:false,
                    error3:true
                };
                default:
            return state;
            }
            }
            
            export const history_reducer= (state = initialState, action) => {
                switch(action.type) {
                    case HISTORY_LOAD:
                    return {
                    HistoryResponse:[],
                    isFetchingHistory:true,
                    error4:false
                    };
                    case HISTORY_XP:
                    return {
                        ...state,
                        HistoryResponse:action.data,
                        isFetchingHistory:false,
                    };
                    case HISTORY_FAIL:
                    return {
                        ...state,
                        isFetchingHistory:false,
                        error4:true
                    };
                    default:
                return state;
                }
                }



 
                export const doctor_reducer= (state = initialState, action) => {
                    switch(action.type) {
                        case DOCTOR_LOAD:
                        return {
                            getDoctorData:[],
                            DoctorDataFetching:true,
                            error5:false
                    
                        
                        };
                        case DOCTOR_XP:
                        return {
                            ...state,
                            getDoctorData:action.data,
                            DoctorDataFetching:false,
                        };
                        case DOCTOR_FAIL:
                        return {
                            ...state,
                            DoctorDataFetching:false,
                            error5:true
                        };
                        default:
                    return state;
                    }
                    }
                    
                     