import{DELMED_XP,DELMED_LOAD,DELMED_FAIL} from '../actionTypes';
const initialState = {
getDelList: [],
isFetching23:false,
error:false
};
const deletemed_reducer= (state = initialState, action) => {
switch(action.type) {
    case DELMED_LOAD:
    return {
    delList:[],
    isFetching23:true,
    error:false

    
    };
    case DELMED_XP:
    return {
        ...state,
        delList:action.data,
        isFetching23:false,
    };
    case DELMED_FAIL:
    return {
        ...state,
        isFetching23:false,
        error:true
    };
    default:
return state;
}
}

export default deletemed_reducer;