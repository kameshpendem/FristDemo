import{SERVICES_SUCCESS,
    SERVICES_LOAD,
    SERVICES_FAIL,
    SAVE_LAB_LOAD,
    SAVE_LAB_SUCCESS,
    SAVE_LAB_FAIL,
    SAVE_IMG_ORDER_FAIL,
SAVE_IMG_ORDER_SUCCESS,
SAVE_IMG_ORDER_LOAD,
SAVE_NURSING_ORDER_LOAD,
    SAVE_NURSING_ORDER_SUCCESS,
    SAVE_NURSING_ORDER_FAIL,
    SAVE_VACCINE_ORDER_LOAD,
    SAVE_VACCINE_ORDER_SUCCESS,
    SAVE_VACCINE_ORDER_FAIL,
    DELETE_LAB_LOAD,
    DELETE_LAB_SUCCESS,
    DELETE_LAB_FAIL,
    DELETE_IMG_ORDER_FAIL,
DELETE_IMG_ORDER_SUCCESS,
DELETE_IMG_ORDER_LOAD,
DELETE_NURSING_ORDER_LOAD,
    DELETE_NURSING_ORDER_SUCCESS,
    DELETE_NURSING_ORDER_FAIL, 
    DELETE_VACCINE_ORDER_LOAD,
    DELETE_VACCINE_ORDER_SUCCESS,
    DELETE_VACCINE_ORDER_FAIL,
    RETRIEVE_PERSON_TIMELINE_FAIL,
    RETRIEVE_PERSON_TIMELINE_SUCCESS,
    RETRIEVE_PERSON_TIMELINE_LOAD,
    REPEAT_LAB_LOAD,
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
    REPEAT_ALL_IMAGING_FAIL,
    RETRIEVE_VACCINE_ORDER_SUCCESS,
    RETRIEVE_VACCINE_ORDER_LOAD,
    RETRIEVE_VACCINE_ORDER_FAIL,
    UPDATE_VACCINEBATCH_FAIL,
    UPDATE_VACCINEBATCH_SUCCESS,
    UPDATE_VACCINEBATCH_LOAD,
} from '../actionTypes';
const initialState = {
ServicesList: [],
isFetchingService:false,
error:false,
isSavingLab:false,
saveLabResponse:"",
error2:false,
isSavingImaging:false,
saveImagingResponse:"",
error3:false,
isSavingNursing:false,
saveNursingResponse:"",
error4:false,
isDeletingLab:false,
deleteLabResponse:"",
error5:false,
isDeletingImaging:false,
deleteImagingResponse:"",
error6:false,
isDeletingNursing:false,
deleteNursingResponse:"",
error7:false,
timelineList: [],
isFetchingTimeline:false,
error8:false,
isRepeatingLab:false,
RepeatingLabResponse:"",
error9:false,
isRepeatingAllLab:false,
RepeatingAllLabResponse:"",
error10:false,
isRepeatingImaging:false,
RepeatingImagingResponse:"",
error11:false,
isRepeatingAllImaging:false,
RepeatingAllImagingResponse:"",
error12:false,
isSavingVaccine:false,
saveVaccineResponse:"",
error13:false,
isDeletingVaccine:false,
deleteVaccineResponse:"",
error14:false,
isFetchingVaccine:false,
fetchingVaccineResponse:"",
error15:false,
isUpdatingBatchVaccine:false,
UpdatingBatchVaccineResponse:"",
error16:false,
};
export const services_reducer= (state = initialState, action) => {
switch(action.type) {
    case SERVICES_LOAD:
    return {
    ServicesList:[],
    isFetchingService:true,
    error:false
    };
    case SERVICES_SUCCESS:
    return {
        ...state,
        ServicesList:action.data,
        isFetchingService:false,
    };
    case SERVICES_FAIL:
    return {
        ...state,
        isFetchingService:false,
        error:true
    };
    default:
return state;
}
}

export const save_lab_reducer= (state = initialState, action) => {
    switch(action.type) {
        case SAVE_LAB_LOAD:
        return {
        saveLabResponse:[],
        isSavingLab:true,
        error2:false
        };
        case SAVE_LAB_SUCCESS:
        return {
            ...state,
            saveLabResponse:action.data,
            isSavingLab:false,
        };
        case SAVE_LAB_FAIL:
        return {
            ...state,
            isSavingLab:false,
            error2:true
        };
        default:
    return state;
    }
    }
    
    export const save_imaging_reducer= (state = initialState, action) => {
        switch(action.type) {
            case SAVE_IMG_ORDER_LOAD:
            return {
                saveImagingResponse:[],
            isSavingImaging:true,
            error3:false
            };
            case SAVE_IMG_ORDER_SUCCESS:
            return {
                ...state,
                saveImagingResponse:action.data,
                isSavingImaging:false,
            };
            case SAVE_IMG_ORDER_FAIL:
            return {
                ...state,
                isSavingImaging:false,
                error3:true
            };
            default:
        return state;
        }
        }
         
    export const save_nursing_reducer= (state = initialState, action) => {
        switch(action.type) {
            case SAVE_NURSING_ORDER_LOAD:
            return {
                saveNursingResponse:[],
            isSavingNursing:true,
            error4:false
            };
            case SAVE_NURSING_ORDER_SUCCESS:
            return {
                ...state,
                saveNursingResponse:action.data,
                isSavingNursing:false,
            };
            case SAVE_NURSING_ORDER_FAIL:
            return {
                ...state,
                isSavingNursing:false,
                error4:true
            };
            default:
        return state;
        }
        
    }

    export const delete_lab_reducer= (state = initialState, action) => {
        switch(action.type) {
            case DELETE_LAB_LOAD:
            return {
                  deleteLabResponse:[],
                  isDeletingLab:true,
            error5:false
            };
            case DELETE_LAB_SUCCESS:
            return {
                ...state,
                deleteLabResponse:action.data,
                isDeletingLab:false,
            };
            case DELETE_LAB_FAIL:
            return {
                ...state,
                isDeletingLab:false,
                error5:true
            };
            default:
        return state;
        }
        }
    export const delete_imaging_reducer= (state = initialState, action) => {
        switch(action.type) {
            case DELETE_IMG_ORDER_LOAD:
            return {
                deleteImagingResponse:[],
            isDeletingImaging:true,
            error6:false
            };
            case DELETE_IMG_ORDER_SUCCESS:
            return {
                ...state,
                deleteImagingResponse:action.data,
                isDeletingImaging:false,
            };
            case DELETE_IMG_ORDER_FAIL:
            return {
                ...state,
                isDeletingImaging:false,
                error6:true
            };
            default:
        return state;
        }
        }

        export const delete_nursing_reducer= (state = initialState, action) => {
            switch(action.type) {
                case DELETE_NURSING_ORDER_LOAD:
                return {
                    deleteNursingResponse:[],
                isDeletingNursing:true,
                error7:false
                };
                case DELETE_NURSING_ORDER_SUCCESS:
                return {
                    ...state,
                    deleteNursingResponse:action.data,
                    isDeletingNursing:false,
                };
                case DELETE_NURSING_ORDER_FAIL:
                return {
                    ...state,
                    isDeletingNursing:false,
                    error7:true
                };
                default:
            return state;
            }
            }
    
            export const retrieve_timeline_reducer= (state = initialState, action) => {
                switch(action.type) {
                    case RETRIEVE_PERSON_TIMELINE_LOAD:
                    return {
                        timelineList:[],
                        isFetchingTimeline:true,
                    error8:false
                    };
                    case RETRIEVE_PERSON_TIMELINE_SUCCESS:
                    return {
                        ...state,
                        timelineList:action.data,
                        isFetchingTimeline:false,
                    };
                    case RETRIEVE_PERSON_TIMELINE_FAIL:
                    return {
                        ...state,
                        isFetchingTimeline:false,
                        error8:true
                    };
                    default:
                return state;
                }
                }
                    
            export const repeat_lab_reducer= (state = initialState, action) => {
                switch(action.type) {
                    case REPEAT_LAB_LOAD:
                    return {
                        RepeatingLabResponse:[],
                        isRepeatingLab:true,
                    error9:false
                    };
                    case REPEAT_LAB_SUCCESS:
                    return {
                        ...state,
                        RepeatingLabResponse:action.data,
                        isRepeatingLab:false,
                    };
                    case REPEAT_LAB_FAIL:
                    return {
                        ...state,
                        isRepeatingLab:false,
                        error9:true
                    };
                    default:
                return state;
                }
                }

                   
            export const repeat_all_lab_reducer= (state = initialState, action) => {
                switch(action.type) {
                    case REPEAT_ALL_LAB_LOAD:
                    return {
                        RepeatingAllLabResponse:[],
                        isRepeatingAllLab:true,
                    error10:false
                    };
                    case REPEAT_ALL_LAB_SUCCESS:
                    return {
                        ...state,
                        RepeatingAllLabResponse:action.data,
                        isRepeatingAllLab:false,
                    };
                    case REPEAT_ALL_LAB_FAIL:
                    return {
                        ...state,
                        isRepeatingAllLab:false,
                        error10:true
                    };
                    default:
                return state;
                }
                }


                export const repeat_imaging_reducer= (state = initialState, action) => {
                    switch(action.type) {
                        case REPEAT_IMAGING_LOAD:
                        return {
                            RepeatingImagingResponse:[],
                            isRepeatingImaging:true,
                        error11:false
                        };
                        case REPEAT_IMAGING_SUCCESS:
                        return {
                            ...state,
                            RepeatingImagingResponse:action.data,
                            isRepeatingImaging:false,
                        };
                        case REPEAT_IMAGING_FAIL:
                        return {
                            ...state,
                            isRepeatingImaging:false,
                            error11:true
                        };
                        default:
                    return state;
                    }
                    }
    
                       
                export const repeat_all_imaging_reducer= (state = initialState, action) => {
                    switch(action.type) {
                        case REPEAT_ALL_IMAGING_LOAD:
                        return {
                            RepeatingAllImagingResponse:[],
                            isRepeatingAllImaging:true,
                        error12:false
                        };
                        case REPEAT_ALL_IMAGING_SUCCESS:
                        return {
                            ...state,
                            RepeatingAllImagingResponse:action.data,
                            isRepeatingAllImaging:false,
                        };
                        case REPEAT_ALL_IMAGING_FAIL:
                        return {
                            ...state,
                            isRepeatingAllImaging:false,
                            error12:true
                        };
                        default:
                    return state;
                    }
                    }
                    export const save_vaccine_reducer= (state = initialState, action) => {
                        switch(action.type) {
                            case SAVE_VACCINE_ORDER_LOAD:
                            return {
                                saveVaccineResponse:[],
                            isSavingVaccine:true,
                            error13:false
                            };
                            case SAVE_VACCINE_ORDER_SUCCESS:
                            return {
                                ...state,
                                saveVaccineResponse:action.data,
                                isSavingVaccine:false,
                            };
                            case SAVE_VACCINE_ORDER_FAIL:
                            return {
                                ...state,
                                isSavingVaccine:false,
                                error13:true
                            };
                            default:
                        return state;
                        }
                        
                    }
                

        export const delete_vaccine_reducer= (state = initialState, action) => {
            switch(action.type) {
                case DELETE_VACCINE_ORDER_LOAD:
                return {
                    deleteVaccineResponse:[],
                isDeletingVaccine:true,
                error14:false
                };
                case DELETE_VACCINE_ORDER_SUCCESS:
                return {
                    ...state,
                    deleteVaccineResponse:action.data,
                    isDeletingVaccine:false,
                };
                case DELETE_VACCINE_ORDER_FAIL:
                return {
                    ...state,
                    isDeletingVaccine:false,
                    error14:true
                };
                default:
            return state;
            }
            }


        export const retrieve_vaccine_reducer= (state = initialState, action) => {
            switch(action.type) {
                case RETRIEVE_VACCINE_ORDER_LOAD:
                return {
                    fetchingVaccineResponse:[],
                isFetchingVaccine:true,
                error15:false
                };
                case RETRIEVE_VACCINE_ORDER_SUCCESS:
                return {
                    ...state,
                    fetchingVaccineResponse:action.data,
                    isFetchingVaccine:false,
                };
                case RETRIEVE_VACCINE_ORDER_FAIL:
                return {
                    ...state,
                    isFetchingVaccine:false,
                    error15:true
                };
                default:
            return state;
            }
            }

        export const update_vaccinebatch_reducer= (state = initialState, action) => {
            switch(action.type) {
                case UPDATE_VACCINEBATCH_LOAD:
                return {
                    UpdatingBatchVaccineResponse:[],
                isUpdatingBatchVaccine:true,
                error16:false
                };
                case UPDATE_VACCINEBATCH_SUCCESS:
                return {
                    ...state,
                    UpdatingBatchVaccineResponse:action.data,
                    isUpdatingBatchVaccine:false,
                };
                case UPDATE_VACCINEBATCH_FAIL:
                return {
                    ...state,
                    isUpdatingBatchVaccine:false,
                    error16:true
                };
                default:
            return state;
            }
            }