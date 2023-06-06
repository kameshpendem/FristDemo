import{CONSULT_XP,CONSULT_LOAD,CONSULT_FAIL} from '../actionTypes';
const initialState = {
getConsultList: [],
isFetching10:false,
error:false
};
const consult_reducer= (state = initialState, action) => {
switch(action.type) {
    case CONSULT_LOAD:
    return {
    consultList:[],
    isFetching10:true,
    error:false

    
    };
    case CONSULT_XP:
    return {
        ...state,
        consultList:action.data,
        isFetching10:false,
    };
    case CONSULT_FAIL:
    return {
        ...state,
        isFetching10:false,
        error:true
    };
    default:
return state;
}
}

export default consult_reducer;