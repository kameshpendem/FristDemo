import{FOR_XP,FOR_LOAD,FOR_FAIL} from '../actionTypes';
const initialState = {
    forList: [],
isFetching4:false,
error:false
};
const for_reducer= (state = initialState, action) => {
switch(action.type) {
    case FOR_LOAD:
    return {
    forList:[],
    isFetching4:true,
    error:false

    
    };
    case FOR_XP:
    return {
        ...state,
        forList:action.data,
        isFetching4:false,
    };
    case FOR_FAIL:
    return {
        ...state,
        isFetching4:false,
        error:true
    };
    default:
return state;
}
}

export default for_reducer;