import{
    SAVE_SUBJECTIVE_SUCCESS,
    SAVE_SUBJECTIVE_LOAD,
    SAVE_SUBJECTIVE_FAIL} from '../actionTypes';

const initialState = {
    subjectiveresponse: "",
    isFetching:false,
    error:false
    };  
    const  subjective_reducer= (state = initialState, action) => {
    switch(action.type) {
    case SAVE_SUBJECTIVE_LOAD:
    return {
        subjectiveresponse: "",
        isFetching:true,
        error:false
    };
    case SAVE_SUBJECTIVE_SUCCESS:
    return {
    ...state,
    isFetching:false,
    subjectiveresponse:action.data
    };
    case SAVE_SUBJECTIVE_FAIL:
    return {
        ...state,
        isFetching:false,
        error:true
    };
    default:
    return state;
    }
    }

    export default subjective_reducer;