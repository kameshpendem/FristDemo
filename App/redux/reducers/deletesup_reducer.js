import{DELMED1_XP,DELMED1_LOAD,DELMED1_FAIL} from '../actionTypes';
const initialState = {
getDelList1: [],
isFetching23:false,
error:false
};
const deletesup_reducer= (state = initialState, action) => {
switch(action.type) {
    case DELMED1_LOAD:
    return {
    delList1:[],
    isFetching23:true,
    error:false

    
    };
    case DELMED1_XP:
    return {
        ...state,
        delList1:action.data,
        isFetching23:false,
    };
    case DELMED1_FAIL:
    return {
        ...state,
        isFetching23:false,
        error:true
    };
    default:
return state;
}
}

export default deletesup_reducer;