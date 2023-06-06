import{MEDICINE1_XP,MEDICINE1_LOAD,MEDICINE1_FAIL} from '../actionTypes';
const initialState = {
getMedicineList1: [],
isFetching23:false,
error:false
};
const medicine_reducer1= (state = initialState, action) => {
switch(action.type) {
    case MEDICINE1_LOAD:
    return {
    medicineList1:[],
    isFetching23:true,
    error:false

    
    };
    case MEDICINE1_XP:
    return {
        ...state,
        medicineList1:action.data,
        isFetching23:false,
    };
    case MEDICINE1_FAIL:
    return {
        ...state,
        isFetching23:false,
        error:true
    };
    default:
return state;
}
}

export default medicine_reducer1;