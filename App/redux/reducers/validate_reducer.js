import{VALIDATE_XP,VALIDATE_LOAD,VALIDATE_FAIL} from '../actionTypes';
const initialState = {
getValidateList: [],
isFetching11:false,
error:false
};
const validate_reducer= (state = initialState, action) => {
switch(action.type) {
    case VALIDATE_LOAD:
    return {
    validateList:[],
    isFetching1:true,
    error:false

    
    };
    case VALIDATE_XP:
    return {
        ...state,
        validateList:action.data,
        isFetching1:false,
    };
    case VALIDATE_FAIL:
    return {
        ...state,
        isFetching1:false,
        error:true
    };
    default:
return state;
}
}

export default validate_reducer;