import{MEDICINE_XP,MEDICINE_LOAD,MEDICINE_FAIL} from '../actionTypes';
const initialState = {
getMedicineList: [],
isFetching10:false,
error:false
};
const medicine_reducer= (state = initialState, action) => {
switch(action.type) {
    case MEDICINE_LOAD:
    return {
    medicineList:[],
    isFetching20:true,
    error:false

    
    };
    case MEDICINE_XP:
    return {
        ...state,
        medicineList:action.data,
        isFetching20:false,
    };
    case MEDICINE_FAIL:
    return {
        ...state,
        isFetching20:false,
        error:true
    };
    default:
return state;
}
}

export default medicine_reducer;