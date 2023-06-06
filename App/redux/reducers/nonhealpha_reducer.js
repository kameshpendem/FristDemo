import{NON_XP,NON_LOAD,NON_FAIL} from '../actionTypes';
const initialState = {
getNonList: [],
isFetching10:false,
error:false
};
const nonhealpha_reducer= (state = initialState, action) => {
switch(action.type) {
    case NON_LOAD:
    return {
    nonList:[],
    isFetching35:true,
    error:false

    
    };
    case NON_XP:
    return {
        ...state,
        nonList:action.data,
        isFetching35:false,
    };
    case NON_FAIL:
    return {
        ...state,
        isFetching35:false,
        error:true
    };
    default:
return state;
}
}

export default nonhealpha_reducer;