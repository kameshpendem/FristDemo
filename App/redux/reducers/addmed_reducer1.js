import{ADDMED1_XP,ADDMED1_LOAD,ADDMED1_FAIL} from '../actionTypes';
const initialState = {
getAddmedList1: [],
isFetching22:false,
error:false
};
const addmed_reducer1= (state = initialState, action) => {
switch(action.type) {
    case ADDMED1_LOAD:
    return {
    addmedList1:[],
    isFetching22:true,
    error:false

    
    };
    case ADDMED1_XP:
    return {
        ...state,
        addmedList1:action.data,
        isFetching22:false,
    };
    case ADDMED1_FAIL:
    return {
        ...state,
        isFetching22:false,
        error:true
    };
    default:
return state;
}
}

export default addmed_reducer1;