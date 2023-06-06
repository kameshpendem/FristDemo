import{IMMUN1_XP,IMMUN1_LOAD,IMMUN1_FAIL} from '../actionTypes';
const initialState = {
getImmunupdateList: [],
isFetching28:false,
error:false
};
const immunupdate_reducer= (state = initialState, action) => {
switch(action.type) {
    case IMMUN1_LOAD:
    return {
    immunupdateList:[],
    isFetching28:true,
    error:false
    };
    case IMMUN1_XP:
    return {
        ...state,
        immunupdateList:action.data,
        isFetching28:false,
    };
    case IMMUN1_FAIL:
    return {
        ...state,
        isFetching28:false,
        error:true
    };
    default:
return state;
}
}

export default immunupdate_reducer;