import{FORGOT_XP,FORGOT_LOAD,FORGOT_FAIL} from '../actionTypes';
const initialState = {
getForgotList: [],
isFetching2:false,
error:false
};
const forgot_reducer= (state = initialState, action) => {
switch(action.type) {
    case FORGOT_LOAD:
    return {
    forgotList:[],
    isFetching2:true,
    error:false

    
    };
    case FORGOT_XP:
    return {
        ...state,
        forgotList:action.data,
        isFetching2:false,
    };
    case FORGOT_FAIL:
    return {
        ...state,
        isFetching2:false,
        error:true
    };
    default:
return state;
}
}

export default forgot_reducer;