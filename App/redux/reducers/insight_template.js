import{
    SAVE_TEMPLATE_SUCCESS,
    SAVE_TEMPLATE_LOAD,
    SAVE_TEMPLATE_FAIL} from '../actionTypes';

const initialState = {
    template_response: "",
    isFetching:false,
    error:false
    };  
    const  insight_template_reducer= (state = initialState, action) => {
    switch(action.type) {
    case SAVE_TEMPLATE_LOAD:
    return {
        template_response: "",
        isFetching:true,
        error:false
    };
    case SAVE_TEMPLATE_SUCCESS:
    return {
    ...state,
    isFetching:false,
    template_response:action.data
    };
    case SAVE_TEMPLATE_FAIL:
    return {
        ...state,
        isFetching:false,
        error:true
    };
    default:
    return state;
    }
    }

    export default insight_template_reducer;