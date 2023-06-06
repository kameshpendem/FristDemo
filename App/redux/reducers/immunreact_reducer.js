import{IMMUN_XP,IMMUN_LOAD,IMMUN_FAIL} from '../actionTypes';
const initialState = {
getImmunreactList: [],
isFetching27:false,
error:false
};
const immunreact_reducer= (state = initialState, action) => {
switch(action.type) {
    case IMMUN_LOAD:
    return {
    immunreactList:[],
    isFetching27:true,
    error:false
    };
    case IMMUN_XP:
    return {
        ...state,
        immunreactList:action.data,
        isFetching27:false,
    };
    case IMMUN_FAIL:
    return {
        ...state,
        isFetching27:false,
        error:true
    };
    default:
return state;
}
}

export default immunreact_reducer;