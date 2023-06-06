import{APPLY_XP,APPLY_LOAD,APPLY_FAIL} from '../actionTypes';
const initialState = {
getApplyList: [],
isFetching19:false,
error:false
};
const tempapply_reducer= (state = initialState, action) => {
switch(action.type) {
    case APPLY_LOAD:
    return {
    applyList:[],
    isFetching19:true,
    error:false

    
    };
    case APPLY_XP:
    return {
        ...state,
        applyList:action.data,
        isFetching19:false,
    };
    case APPLY_FAIL:
    return {
        ...state,
        isFetching19:false,
        error:true
    };
    default:
return state;
}
}

export default tempapply_reducer;