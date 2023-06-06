import{PRESEC_XP,PRESEC_LOAD,PRESEC_FAIL} from '../actionTypes';
const initialState = {
getPresecList: [],
isFetching25:false,
error:false
};
const presec_reducer= (state = initialState, action) => {
switch(action.type) {
    case PRESEC_LOAD:
    return {
    presecList:[],
    isFetching25:true,
    error:false

    
    };
    case PRESEC_XP:
    return {
        ...state,
        presecList:action.data,
        isFetching25:false,
    };
    case PRESEC_FAIL:
    return {
        ...state,
        isFetching25:false,
        error:true
    };
    default:
return state;
}
}

export default presec_reducer;