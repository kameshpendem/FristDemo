import{
    SAVE_ASSESSMENT_SUCCESS,
    SAVE_ASSESSMENT_LOAD,
    SAVE_ASSESSMENT_FAIL} from '../actionTypes';

const initialState = {
    assessmentresponse: "",
    isFetching:false,
    error:false
    };
    const  assessment_reducer= (state = initialState, action) => {
    switch(action.type) {
    case SAVE_ASSESSMENT_LOAD:
    return {
        assessmentresponse: "",
        isFetching:true,
        error:false
    };
    case SAVE_ASSESSMENT_SUCCESS:
    return {
    ...state,
    isFetching:false,
    assessmentresponse:action.data
    };
    case SAVE_ASSESSMENT_FAIL:
    return {
        ...state,
        isFetching:false,
        error:true
    };
    default:
    return state;
    }
    }

    export default assessment_reducer;