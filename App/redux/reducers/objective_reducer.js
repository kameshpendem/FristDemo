import{
    SAVE_OBJECTIVE_SUCCESS,
    SAVE_OBJECTIVE_LOAD,
    SAVE_OBJECTIVE_FAIL} from '../actionTypes';

const initialState = {
    objectiveresponse: "",
    isFetching:false,
    error:false
    };
    const  objective_reducer= (state = initialState, action) => {
    switch(action.type) {
    case SAVE_OBJECTIVE_LOAD:
    return {
        objectiveresponse:"",
        isFetching:true,
        error:false
    };
    case SAVE_OBJECTIVE_SUCCESS:
    return {
    ...state,
    isFetching:false,
    objectiveresponse:action.data
    };
    case SAVE_OBJECTIVE_FAIL:
    return {
        ...state,
        isFetching:false,
        error:true
    };
    default:
    return state;
    }
    }

    export default objective_reducer;