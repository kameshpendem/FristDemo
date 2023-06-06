import{OLDPATIENT_XP,OLDPATIENT_LOAD,OLDPATIENT_FAIL} from '../actionTypes';
const initialState = {
getOldList: [],
isFetching15:false,
error:false
};
const oldpatient_reducer= (state = initialState, action) => {
switch(action.type) {
    case OLDPATIENT_LOAD:
    return {
    oldList:[],
    isFetching15:true,
    error:false

    
    };
    case OLDPATIENT_XP:
    return {
        ...state,
        oldList:action.data,
        isFetching15:false,
    };
    case OLDPATIENT_FAIL:
    return {
        ...state,
        isFetching15:false,
        error:true
    };
    default:
return state;
}
}

export default oldpatient_reducer;