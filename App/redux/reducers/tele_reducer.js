import{TELE_XP,TELE_LOAD,TELE_FAIL} from '../actionTypes';
const initialState = {
getTeleList: [],
isFetching120:false,
error:false
};
const tele_reducer= (state = initialState, action) => {
switch(action.type) {
    case TELE_LOAD:
    return {
    teleList:[],
    isFetching120:true,
    error:false

    
    };
    case TELE_XP:
    return {
        ...state,
        teleList:action.data,
        isFetching120:false,
    };
    case TELE_FAIL:
    return {
        ...state,
        isFetching120:false,
        error:true
    };
    default:
return state;
}
}

export default tele_reducer;