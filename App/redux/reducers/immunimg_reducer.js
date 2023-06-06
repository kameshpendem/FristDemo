import{IMMUN2_XP,IMMUN2_LOAD,IMMUN2_FAIL} from '../actionTypes';
const initialState = {
getImmunimgList: [],
isFetching26:false,
error:false
};
const immunimg_reducer= (state = initialState, action) => {
switch(action.type) {
    case IMMUN2_LOAD:
    return {
    immunimgList:[],
    isFetching26:true,
    error:false
    };
    case IMMUN2_XP:
    return {
        ...state,
        immunimgList:action.data,
        isFetching26:false,
    };
    case IMMUN2_FAIL:
    return {
        ...state,
        isFetching26:false,
        error:true
    };
    default:
return state;
}
}

export default immunimg_reducer;