import{ENC_XP,ENC_LOAD,ENC_FAIL} from '../actionTypes';
const initialState = {
getEncList: [],
isFetching13:false,
error:false
};
const enc_reducer= (state = initialState, action) => {
switch(action.type) {
    case ENC_LOAD:
    return {
    encList:[],
    isFetching13:true,
    error:false

    
    };
    case ENC_XP:
    return {
        ...state,
        encList:action.data,
        isFetching13:false,
    };
    case ENC_FAIL:
    return {
        ...state,
        isFetching13:false,
        error:true
    };
    default:
return state;
}
}

export default enc_reducer;